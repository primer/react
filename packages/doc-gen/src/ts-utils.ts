import ts from 'typescript'
import fs from 'node:fs'
import path from 'path'
import prettier from 'prettier'
import signale, {type DefaultMethods} from 'signale'
import type {DocsPropInfo} from './types'

type Logger = signale.Signale<DefaultMethods>

const {Signale} = signale

export interface TSPropInfo extends DocsPropInfo {
  propSymbol: ts.Symbol
  source?: ts.SourceFile
}

export interface TSParsedComponentInfo {
  sourceFile: string
  componentPath: string
  componentName: string
  props: Record<string, TSPropInfo | undefined>

  subComponents?: Record<string, TSParsedComponentInfo>
}

function getFirstMatchingFile(componentPath: string, componentName: string): string | undefined {
  const paths = [
    path.join(componentPath, `index.ts`),
    path.join(componentPath, `index.tsx`),
    path.join(componentPath, `${componentName}.tsx`),
  ]

  for (const p of paths) {
    try {
      fs.accessSync(p, fs.constants.R_OK)
      return p
    } catch {
      // File does not exist or is not readable, continue to next path
    }
  }

  return undefined
}

export function getTSProgram(rootDir?: string) {
  const configSearchDir = rootDir ? path.resolve(rootDir) : process.cwd()
  const configPath = ts.findConfigFile(configSearchDir, ts.sys.fileExists)
  const fallbackConfigPath = path.join(configSearchDir, 'tsconfig.json')
  const config = ts.readConfigFile(configPath ?? fallbackConfigPath, ts.sys.readFile)
  const parsedConfig = ts.parseJsonConfigFileContent(
    config.config,
    ts.sys,
    configPath ? path.dirname(configPath) : configSearchDir,
    undefined,
    configPath ?? fallbackConfigPath,
  )
  const program = ts.createProgram({
    rootNames: parsedConfig.fileNames,
    options: parsedConfig.options,
  })

  return program
}

function getComponentExport(
  log: Logger,
  program: ts.Program,
  sourceFile: ts.SourceFile,
  componentName: string,
): ts.Symbol {
  const checker = program.getTypeChecker()
  const sourceSymbol = checker.getSymbolAtLocation(sourceFile)

  if (!sourceSymbol) {
    throw new Error(`No symbol found for source file ${sourceFile.fileName}`)
  }

  const exports = checker.getExportsOfModule(sourceSymbol)

  const sourceExport =
    exports.find(s => s.escapedName === componentName) ?? exports.find(s => s.escapedName === 'default')

  if (!sourceExport) {
    log.error(
      `Component ${componentName} not found in ${sourceFile.fileName}. Found exports: ${Array.from(exports.map(s => s.escapedName)).join(', ')}`,
    )
    throw new Error(`Component ${componentName} not found in ${sourceFile.fileName}`)
  }

  return sourceExport
}

/**
 * Given the symbol for a component, grab all the sub-component properties for it
 */
function getSubComponentsForSymbol(
  log: Logger,
  program: ts.Program,
  componentSymbol: ts.Symbol,
): Record<string, ts.Node> {
  const checker = program.getTypeChecker()
  const componentNode = getComponentNodeForSymbol(checker, componentSymbol)
  const componentType = checker.getTypeAtLocation(componentNode)

  if (componentType.getProperties().length === 0) {
    return {}
  }

  return componentType.getProperties().reduce(
    (acc, prop) => {
      if (prop.valueDeclaration) {
        const subCompType = checker.getTypeAtLocation(prop.valueDeclaration)

        // Use the call-signature as a Proxy for this being a React component
        // There might be a more reliable way, but this removes `defaultProps`, `displayName`, etc
        if (subCompType.getCallSignatures().length > 0) {
          acc[prop.getName()] = prop.valueDeclaration
        }
      }

      return acc
    },
    {} as Record<string, ts.Node>,
  )
}

function getPropTypesForNode(log: Logger, checker: ts.TypeChecker, componentNode: ts.Node): Record<string, TSPropInfo> {
  const props: Record<string, TSPropInfo> = {}

  const componentType = checker.getTypeAtLocation(componentNode)

  const callSignatures = componentType.getCallSignatures()

  for (const callSignature of callSignatures) {
    log.debug(`Call signature: ${checker.signatureToString(callSignature)}`)

    const params = callSignature.getParameters()

    if (params.length === 0 || params[0].valueDeclaration === undefined) {
      continue
    }

    log.debug(params[0].valueDeclaration!.getFullText())

    const propTypesType = checker.getTypeOfSymbolAtLocation(params[0], componentNode)

    for (const prop of checker.getApparentType(propTypesType).getApparentProperties()) {
      const propType = checker.getTypeOfSymbolAtLocation(prop, componentNode)

      const propSource = prop.getDeclarations()?.[0]?.getSourceFile()

      if (propSource && /node_modules/.test(propSource.fileName)) {
        // log.warn(
        //   `Prop ${prop.getName()} is declared in a third-party module (${propSource.fileName}). It will be ignored.`,
        // )
        continue
      }

      const isRequired = !(prop.getFlags() & ts.SymbolFlags.Optional)
      let typeString = checker.typeToString(propType)

      if (!isRequired && typeString.endsWith('| undefined')) {
        typeString = typeString.slice(0, -'| undefined'.length).trim()
      }

      if (prop.getName() === 'children') {
        typeString = 'React.ReactElement[]'
      }

      props[prop.getName()] = {
        name: prop.getName(),
        type: typeString,
        propSymbol: prop,
        required: isRequired,
        source: propSource,
        defaultValue: prop
          .getJsDocTags()
          .find(tag => tag.name === 'default')
          ?.text?.map(t => t.text)
          .join(' '),
        description: ts.displayPartsToString(prop.getDocumentationComment(checker)),
      }
    }
  }

  return props
}

/**
 * Given a component node (the node that is exported at the root), resolve it to the _thing_ that it actually represents.
 * i.e. Follow any redirects for exports, renaming, etc
 */
function getComponentNodeForSymbol(checker: ts.TypeChecker, componentSymbol: ts.Symbol): ts.Node {
  const declarations = componentSymbol.getDeclarations()
  if (!declarations || declarations.length === 0) {
    throw new Error(`No declarations found for component ${componentSymbol.getName()}`)
  }

  let declaration = declarations[0]

  if (ts.isExportAssignment(declaration)) {
    // If the declaration is an export assignment, we need to find the symbol it exports
    const exportSymbol = checker.getSymbolAtLocation(declaration.getChildren()[0])
    if (!exportSymbol) {
      throw new Error(`Unable to find export symbol for component ${componentSymbol.getName()}`)
    }
    const exportDeclarations = exportSymbol.getDeclarations()
    if (!exportDeclarations || exportDeclarations.length === 0) {
      throw new Error(`No declarations found for export symbol of component ${componentSymbol.getName()}`)
    }
    declaration = exportDeclarations[0]
  }

  if (ts.isVariableDeclaration(declaration)) {
    return declaration.initializer!
  }

  return declaration
}

function getPropTypeForComponent(
  log: Logger,
  program: ts.Program,
  componentSymbol: ts.Symbol,
): Record<string, TSPropInfo> {
  const checker = program.getTypeChecker()

  const componentNode = getComponentNodeForSymbol(checker, componentSymbol)

  return getPropTypesForNode(log, checker, componentNode)
}

export function parseTypeInfo(
  docsBasePath: string,
  componentName: string,
  program: ts.Program = getTSProgram(docsBasePath),
): TSParsedComponentInfo {
  const log = new Signale({
    scope: componentName,
    logLevel: process.env.DEBUG === '*' ? 'debug' : 'error',
  })

  log.debug(`Looking for first match in: ${docsBasePath}`)
  const componentFile = getFirstMatchingFile(docsBasePath, componentName)

  if (!componentFile) {
    throw new Error(`No source file found for component ${componentName}`)
  }

  log.debug(`Found source for ${componentName}: ${componentFile}`)

  const sourceFile = program.getSourceFile(componentFile)

  if (!sourceFile) {
    log.error(`Unable to retrieve source file for ${componentName}`)
    throw new Error(`Unable to retrieve source file for ${componentName}`)
  }

  const exportedComponent = getComponentExport(log, program, sourceFile, componentName)
  const propsType = getPropTypeForComponent(log, program, exportedComponent)
  const subComponents = getSubComponentsForSymbol(log, program, exportedComponent)

  log.debug(`Extracted props for ${componentName}: ${Object.keys(propsType).join(', ')}`)

  return {
    sourceFile: componentFile,
    componentPath: docsBasePath,
    componentName,
    props: propsType,
    subComponents: Object.fromEntries(
      Object.entries(subComponents).map(([name, node]) => {
        const subComponentType = getPropTypesForNode(log, program.getTypeChecker(), node)
        return [
          name,
          {
            sourceFile: componentFile,
            componentPath: docsBasePath,
            componentName: [componentName, name].join('.'),
            props: subComponentType,
          },
        ]
      }),
    ),
  }
}

export function generateJSDocString(tsPropInfo: TSPropInfo, docsProps: DocsPropInfo): string {
  let newJsDocText = '/**\n'
  if (docsProps.description) {
    newJsDocText += ` * ${docsProps.description}\n`
  }
  if (docsProps.defaultValue !== undefined && docsProps.defaultValue !== '') {
    if (tsPropInfo.type === 'boolean' || tsPropInfo.type === 'number') {
      newJsDocText += ` *\n * @default ${docsProps.defaultValue}\n`
    } else if (typeof docsProps.defaultValue === 'string') {
      // Unwrap the default value in case it's wrapped in quotes
      const unwrapped = docsProps.defaultValue.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1')

      newJsDocText += ` *\n * @default "${unwrapped}"\n`
    }
  }

  if (docsProps.deprecated) {
    newJsDocText += ` * @deprecated\n`
  }

  newJsDocText += ' */'

  return newJsDocText
}

export async function updateJSDocsForProp(tsPropInfo: TSPropInfo, docsProps: DocsPropInfo, componentSourceDir: string) {
  const {propSymbol} = tsPropInfo

  // Update the JSDoc comment to use the description & defaultValue from the docsProps.
  // Everything else should be the same

  const declarations = propSymbol.getDeclarations()
  if (!declarations || declarations.length === 0) {
    throw new Error(`No declarations found for prop ${propSymbol.getName()}`)
  }

  const declaration = declarations[0]
  const sourceFile = declaration.getSourceFile()

  if (!sourceFile.fileName.startsWith(componentSourceDir)) {
    // eslint-disable-next-line no-console
    console.log(`Skipping prop ${propSymbol.getName()} from file ${sourceFile.fileName}`)
    // eslint-disable-next-line no-console
    console.log(`Source Dir: ${componentSourceDir}`)
    return
  }

  // read this directly since other things may have updated it
  const text = await fs.promises.readFile(sourceFile.fileName, 'utf-8')

  // Find the JSDoc comment associated with the prop
  const jsDoc = ts.getJSDocCommentsAndTags(declaration).find(ts.isJSDoc)
  const newJsDocText = generateJSDocString(tsPropInfo, docsProps)

  let updatedText: string | undefined

  if (jsDoc) {
    // If a JSDoc comment exists, replace it
    const start = jsDoc.getStart()
    const end = jsDoc.getEnd()
    updatedText = text.slice(0, start) + newJsDocText + text.slice(end)
  } else {
    // If no JSDoc comment exists, insert one before the declaration
    const start = declaration.getStart()
    updatedText = `${text.slice(0, start) + newJsDocText}\n${text.slice(start)}`
  }

  if (updatedText) {
    // Run prettier on the file

    const prettierConfig = await prettier.resolveConfig(sourceFile.fileName)
    updatedText = await prettier.format(updatedText, {...prettierConfig, filepath: sourceFile.fileName})
    fs.writeFileSync(sourceFile.fileName, updatedText, 'utf-8')
  }
}

/** Splits a union at depth zero so nested generics keep their own `|` separators. */
function splitUnion(type: string): string[] {
  const members: string[] = []
  let depth = 0
  let current = ''
  for (const character of type) {
    if ('<([{'.includes(character)) depth += 1
    if ('>)]}'.includes(character)) depth -= 1
    if (character === '|' && depth === 0) {
      members.push(current.trim())
      current = ''
      continue
    }
    current += character
  }
  if (current.trim()) members.push(current.trim())
  return members
}

/** Constituents TypeScript produces when it expands `React.ReactNode`. */
const REACT_NODE_MEMBER =
  /^(string|number|bigint|boolean|null|undefined|ReactPortal|ReactNode|Iterable<[^>]*ReactNode[^>]*>|Promise<.*>|ReactElement<\s*unknown\s*,.*>|ReactElement<\.\.\.>|Omit<ReactElement<\s*unknown\s*,.*>)$/

/** Constituents TypeScript produces when it expands `React.ElementType`. */
const REACT_ELEMENT_TYPE_MEMBER =
  /^(ComponentClass<.*>|FunctionComponent<.*>|ComponentType<.*>|JSXElementConstructor<.*>|keyof IntrinsicElements)$/

/**
 * A token that only appears once TypeScript has walked into React's own types. Matched
 * anywhere in a member, so a boundary nested in a callback return type is still found.
 */
const REACT_BOUNDARY = /\b(ReactPortal|ReactNode|ReactElement<|JSXElementConstructor<)/

/** `ReactElement<unknown, ...>` carries no useful element information. */
const OPAQUE_REACT_ELEMENT = /^ReactElement<\s*unknown\s*,/

/** `ReactElement<Props, ...>` carries props a reader wants, unlike the opaque form. */
const TYPED_REACT_ELEMENT = /^ReactElement<(?!\s*unknown\s*,)(?!\.\.\.>)/

/** Removes the element-constructor argument TypeScript appends to every `ReactElement`. */
function dropElementConstructorArgument(member: string): string {
  return member.replace(/,\s*string \| JSXElementConstructor<any>\s*>$/, '>')
}

/**
 * Stops type expansion at React's own node types.
 *
 * TypeScript resolves `React.ReactNode` into a fifteen-member union and `React.ReactElement`
 * into `ReactElement<unknown, string | JSXElementConstructor<any>>`. Neither tells a reader
 * anything they did not already know, and both crowd out the part of a signature that does
 * carry meaning. This collapses those expansions back to the names an author writes, and
 * leaves every other union member untouched.
 */
export function simplifyReactType(type: string): string {
  const members = splitUnion(type)
  if (!members.some(member => REACT_BOUNDARY.test(member))) return qualifyReactNames(type)

  // A lone element type keeps its own name; only a full node expansion becomes ReactNode.
  if (members.length === 1 && OPAQUE_REACT_ELEMENT.test(members[0])) return 'React.ReactElement'
  if (members.length === 1 && TYPED_REACT_ELEMENT.test(members[0])) {
    return `React.${dropElementConstructorArgument(members[0])}`
  }

  const simplified: string[] = []
  for (const member of members) {
    let replacement = member
    if (REACT_NODE_MEMBER.test(member)) replacement = 'React.ReactNode'
    else if (REACT_ELEMENT_TYPE_MEMBER.test(member)) replacement = 'React.ElementType'
    else if (member.includes('ReactElement<') || member.includes('ReactNode')) {
      replacement = simplifyNested(member)
    }
    if (!simplified.includes(replacement)) simplified.push(replacement)
  }

  return qualifyReactNames(simplified.join(' | '))
}

/**
 * React types arrive from the checker without their namespace, so `ElementType` reads as a
 * local type a consumer could import. Qualifying them keeps their origin obvious.
 */
const BARE_REACT_NAMES = /(?<!\.)\b(ElementType|ComponentType|ReactNode|ReactElement|ReactPortal|CSSProperties)\b/g

/** Default type arguments the checker spells out but an author never writes. */
const DEFAULTED_TYPE_ARGUMENTS = /\bElementType<\s*any\s*,\s*keyof IntrinsicElements\s*>/g

function qualifyReactNames(type: string): string {
  return type.replace(DEFAULTED_TYPE_ARGUMENTS, 'ElementType').replace(BARE_REACT_NAMES, 'React.$1')
}

/** Applies the same boundary inside a wrapper such as a callback return type. */
function simplifyNested(member: string): string {
  return member
    .replace(/ReactElement<\s*unknown\s*,\s*string\s*\|\s*JSXElementConstructor<any>\s*>/g, 'React.ReactElement')
    .replace(/(?<!React\.)\bReactNode\b/g, 'React.ReactNode')
}

/**
 * DOM interfaces that name exactly one tag. Interfaces shared by several tags — `HTMLElement`,
 * `HTMLHeadingElement`, `HTMLTableCellElement`, `HTMLTableSectionElement` — are deliberately
 * absent, because reporting one of their tags would be a guess.
 */
const ELEMENT_INTERFACE_TAGS: Record<string, string> = {
  HTMLAnchorElement: 'a',
  HTMLAudioElement: 'audio',
  HTMLBRElement: 'br',
  HTMLButtonElement: 'button',
  HTMLCanvasElement: 'canvas',
  HTMLDListElement: 'dl',
  HTMLDataElement: 'data',
  HTMLDetailsElement: 'details',
  HTMLDialogElement: 'dialog',
  HTMLDivElement: 'div',
  HTMLFieldSetElement: 'fieldset',
  HTMLFormElement: 'form',
  HTMLHRElement: 'hr',
  HTMLIFrameElement: 'iframe',
  HTMLImageElement: 'img',
  HTMLInputElement: 'input',
  HTMLLIElement: 'li',
  HTMLLabelElement: 'label',
  HTMLLegendElement: 'legend',
  HTMLMenuElement: 'menu',
  HTMLMeterElement: 'meter',
  HTMLOListElement: 'ol',
  HTMLOptGroupElement: 'optgroup',
  HTMLOptionElement: 'option',
  HTMLOutputElement: 'output',
  HTMLParagraphElement: 'p',
  HTMLPictureElement: 'picture',
  HTMLPreElement: 'pre',
  HTMLProgressElement: 'progress',
  HTMLSelectElement: 'select',
  HTMLSpanElement: 'span',
  HTMLTableCaptionElement: 'caption',
  HTMLTableElement: 'table',
  HTMLTableRowElement: 'tr',
  HTMLTextAreaElement: 'textarea',
  HTMLTimeElement: 'time',
  HTMLUListElement: 'ul',
  HTMLVideoElement: 'video',
  SVGSVGElement: 'svg',
}

/**
 * Reads the one tag a DOM interface names, such as `p` for `HTMLParagraphElement`, so
 * documentation can say which element a component renders and which native attributes it
 * therefore accepts.
 *
 * Returns nothing for an interface shared by several tags, because the element is genuinely
 * not determined by the type.
 */
export function readElementTag(interfaceName: string): string | undefined {
  return Object.hasOwn(ELEMENT_INTERFACE_TAGS, interfaceName) ? ELEMENT_INTERFACE_TAGS[interfaceName] : undefined
}
