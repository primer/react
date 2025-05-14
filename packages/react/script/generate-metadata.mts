import path from 'node:path'
import {getMetadataFromSourceFile, format} from '@primer/react-metadata'
import ts from 'typescript'

async function main() {
  const config = ts.readConfigFile('tsconfig.json', ts.sys.readFile)
  const parsedConfig = ts.parseJsonConfigFileContent(config.config, ts.sys, process.cwd(), undefined, 'tsconfig.json')
  const program = ts.createProgram({
    rootNames: parsedConfig.fileNames,
    options: parsedConfig.options,
  })
  const typeChecker = program.getTypeChecker()
  // const sourceFile = program.getSourceFile(path.resolve('./src/Banner/Banner.tsx'))
  const sourceFile = program.getSourceFile(path.resolve('./src/index.ts'))
  const metadata = getMetadataFromSourceFile(typeChecker, sourceFile)

  for (const exportInfo of metadata.exports) {
    console.log(format(exportInfo))
  }
}

main().catch(error => {
  console.log(error)
  process.exit(1)
})
