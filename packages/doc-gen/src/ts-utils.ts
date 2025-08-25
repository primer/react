import ts from 'typescript'
import fs from 'fs'
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
  props: Record<string, TSPropInfo>
}

async function getFirstMatchingFile(componentPath: string, componentName: string): Promise<string | undefined> {
  const paths = [
    path.join(componentPath, `${componentName}.tsx`),
    path.join(componentPath, `index.ts`),
    path.join(componentPath, `index.tsx`),
  ]

  for (const p of paths) {
    try {
      await fs.promises.access(p, fs.constants.R_OK)
      return p
    } catch {
      // File does not exist or is not readable, continue to next path
    }
  }

  return undefined
}

export function getTSProgram() {
  const config = ts.readConfigFile('tsconfig.json', ts.sys.readFile)
  const parsedConfig = ts.parseJsonConfigFileContent(config.config, ts.sys, process.cwd(), undefined, 'tsconfig.json')
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

  const sourceExport =
    sourceSymbol.exports?.get(componentName as ts.__String) ?? sourceSymbol.exports?.get('default' as ts.__String)

  if (!sourceExport) {
    log.error(`Component ${componentName} not found in ${sourceFile.fileName}`)
    throw new Error(`Component ${componentName} not found in ${sourceFile.fileName}`)
  }

  return sourceExport
}

function getPropTypeForComponent(
  log: Logger,
  program: ts.Program,
  componentSymbol: ts.Symbol,
): Record<string, TSPropInfo> {
  const checker = program.getTypeChecker()

  const declarations = componentSymbol.getDeclarations()
  if (!declarations || declarations.length === 0) {
    throw new Error(`No declarations found for component ${componentSymbol.getName()}`)
  }

  const declaration = declarations[0]

  if (!ts.isFunctionLike(declaration) && !ts.isVariableDeclaration(declaration)) {
    throw new Error(
      `Component ${componentSymbol.getName()} is not a function or variable declaration. Found type: ${ts.SyntaxKind[declaration.kind]}`,
    )
  }

  const functionType = checker.getTypeAtLocation(
    ts.isVariableDeclaration(declaration) ? declaration.initializer! : declaration,
  )
  const props: Record<string, TSPropInfo> = {}

  const callSignatures = functionType.getCallSignatures()

  for (const callSignature of callSignatures) {
    // log.debug(`Call signature: ${checker.signatureToString(callSignature)}`)

    const params = callSignature.getParameters()

    // log.debug(params[0].valueDeclaration!.getFullText())

    const propTypesType = checker.getTypeOfSymbolAtLocation(params[0], declaration)

    for (const prop of checker.getApparentType(propTypesType).getApparentProperties()) {
      const propType = checker.getTypeOfSymbolAtLocation(prop, declaration)

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

export async function parseTypeInfo(
  docsBasePath: string,
  componentName: string,
  program: ts.Program = getTSProgram(),
): Promise<TSParsedComponentInfo> {
  const log = new Signale({scope: componentName})
  const componentFile = await getFirstMatchingFile(docsBasePath, componentName)

  if (!componentFile) {
    // log.error(`No source file found for component ${componentName}`)
    throw new Error(`No source file found for component ${componentName}`)
  }

  // log.debug(`Found source for ${componentName}: ${componentFile}`)

  const sourceFile = program.getSourceFile(componentFile)

  if (!sourceFile) {
    // log.error(`Unable to retrieve source file for ${componentName}`)
    throw new Error(`Unable to retrieve source file for ${componentName}`)
  }

  const exportedComponent = getComponentExport(log, program, sourceFile, componentName)
  const propsType = getPropTypeForComponent(log, program, exportedComponent)

  // log.debug(`Extracted props for ${componentName}: ${Object.keys(propsType).join(', ')}`)

  return {
    sourceFile: componentFile,
    componentPath: docsBasePath,
    componentName,
    props: propsType,
  }
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
    console.log(`Skipping prop ${propSymbol.getName()} from file ${sourceFile.fileName}`)
    console.log(`Source Dir: ${componentSourceDir}`)
    return
  }

  const text = sourceFile.getFullText()

  // Find the JSDoc comment associated with the prop
  const jsDoc = ts.getJSDocCommentsAndTags(declaration).find(ts.isJSDoc)

  let newJsDocText = '/**\n'
  if (docsProps.description) {
    newJsDocText += ` * ${docsProps.description}\n`
  }
  if (docsProps.defaultValue !== undefined && docsProps.defaultValue !== '') {
    if (tsPropInfo.type === 'boolean' || tsPropInfo.type === 'number') {
      newJsDocText += ` * @default ${docsProps.defaultValue}\n`
    } else {
      newJsDocText += ` * @default "${docsProps.defaultValue}"\n`
    }
  }
  newJsDocText += ' */'

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
    await fs.promises.writeFile(sourceFile.fileName, updatedText, 'utf-8')
  }
}
