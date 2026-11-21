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

function extractProps(
  checker: ts.TypeChecker,
  propsType: ts.Type,
  location: ts.Node,
  formatType: (type: ts.Type) => string,
): Array<TSPropInfo> {
  const props: Array<TSPropInfo> = []
  for (const prop of checker.getApparentType(propsType).getApparentProperties()) {
    const source = prop.getDeclarations()?.[0]?.getSourceFile()
    if (source && /node_modules/.test(source.fileName)) {
      continue
    }
    const required = !(prop.getFlags() & ts.SymbolFlags.Optional)
    let type = formatType(checker.getTypeOfSymbolAtLocation(prop, location))
    if (!required && type.endsWith('| undefined')) {
      type = type.slice(0, -'| undefined'.length).trim()
    }
    props.push({
      name: prop.getName(),
      type,
      propSymbol: prop,
      required,
      source,
      defaultValue: prop
        .getJsDocTags()
        .find(tag => tag.name === 'default')
        ?.text?.map(part => part.text)
        .join(' '),
      description: ts.displayPartsToString(prop.getDocumentationComment(checker)),
    })
  }
  return props
}

/** Extract one resolved props or configuration type without reading component metadata. */
export function extractSourceProps(checker: ts.TypeChecker, propsType: ts.Type, location: ts.Node): Array<TSPropInfo> {
  return extractProps(checker, propsType, location, type => {
    return checker.typeToString(type, location, ts.TypeFormatFlags.NoTruncation)
  })
}

function getPropTypesForNode(log: Logger, checker: ts.TypeChecker, componentNode: ts.Node): Record<string, TSPropInfo> {
  const props: Record<string, TSPropInfo> = {}
  const componentType = checker.getTypeAtLocation(componentNode)
  for (const signature of componentType.getCallSignatures()) {
    log.debug(`Call signature: ${checker.signatureToString(signature)}`)
    const parameter = signature.getParameters().at(0)
    if (!parameter?.valueDeclaration) {
      continue
    }
    log.debug(parameter.valueDeclaration.getFullText())
    const propsType = checker.getTypeOfSymbolAtLocation(parameter, componentNode)
    const extracted = extractProps(checker, propsType, componentNode, type => {
      return checker.typeToString(type)
    })
    for (const prop of extracted) {
      props[prop.name] = prop.name === 'children' ? {...prop, type: 'React.ReactElement[]'} : prop
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
