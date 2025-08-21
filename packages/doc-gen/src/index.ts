import fs from 'fs'
import path from 'path'
import ts from 'typescript'

interface PropInfo {
  required: boolean
  type?: string
  description?: string
  defaultValue?: string
}

function getTypeInformationFromTS(program: ts.Program, componentPath: string, componentName: string) {
  let sourceFile: ts.SourceFile | undefined

  sourceFile = program.getSourceFile(path.join(componentPath, `${componentName}.tsx`))
  if (!sourceFile) {
    sourceFile = program.getSourceFile(path.join(componentPath, `index.ts`))
  }
  if (!sourceFile) {
    sourceFile = program.getSourceFile(path.join(componentPath, `index.tsx`))
  }

  if (!sourceFile) {
    throw new Error(`Source file not found: ${componentPath}`)
  }

  const checker = program.getTypeChecker()
  const sourceFileSymbol = checker.getSymbolAtLocation(sourceFile)
  if (!sourceFileSymbol) {
    throw new Error(`Symbol not found for source file: ${componentPath}`)
  }

  const exports = checker.getExportsOfModule(sourceFileSymbol)

  const componentSymbol = exports.find(sym => sym.getName() === componentName)

  if (!componentSymbol) {
    throw new Error(`Component ${componentName} not found in file ${componentPath}`)
  }

  const type = checker.getTypeOfSymbolAtLocation(componentSymbol, componentSymbol.valueDeclaration!)
  const propTypesSig = type.getCallSignatures()[0].getParameters()[0]

  const propTypes = checker.getTypeOfSymbolAtLocation(propTypesSig, propTypesSig.valueDeclaration!)
  const propSummary: Record<string, PropInfo | undefined> = {}

  for (const prop of propTypes.getProperties()) {
    const name = prop.getName()

    const defaultValueJSDoc = prop.getJsDocTags().find(tag => tag.name === 'default')
    const docComment = prop.getDocumentationComment(checker)

    propSummary[name] = {
      required: !(prop.flags & ts.SymbolFlags.Optional),
      type: checker.typeToString(checker.getTypeOfSymbolAtLocation(prop, prop.valueDeclaration!)),
      description: docComment.length > 0 ? ts.displayPartsToString(docComment) : undefined,
      defaultValue: defaultValueJSDoc ? ts.displayPartsToString(defaultValueJSDoc.text) : undefined,
    }
  }

  return propSummary
}

function getTSProgram() {
  const config = ts.readConfigFile('tsconfig.json', ts.sys.readFile)
  const parsedConfig = ts.parseJsonConfigFileContent(config.config, ts.sys, process.cwd(), undefined, 'tsconfig.json')
  const program = ts.createProgram({
    rootNames: parsedConfig.fileNames,
    options: parsedConfig.options,
  })

  return program
}

export function processDocsFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const docs = JSON.parse(fileContent)

  try {
    const componentEntry = path.dirname(filePath)

    const program = getTSProgram()
    const typeInfo = getTypeInformationFromTS(program, componentEntry, docs.name)

    // merge type info with the default file contents

    docs.props = docs.props.map(({derive, ...defaultPropInfo}: {name: string; derive?: boolean}) => {
      if (derive) {
        const propEntry = typeInfo[defaultPropInfo.name]
        if (!propEntry) {
          throw new Error(`No type information found for prop '${defaultPropInfo.name}'`)
        }

        return {
          ...defaultPropInfo,
          ...propEntry,
        }
      }

      return defaultPropInfo
    })
  } catch (e: any) {
    console.error(`Error processing file ${filePath}:`, e.message)
  }

  return docs
}
