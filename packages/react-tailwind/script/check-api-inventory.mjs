import {readFile} from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import Ajv from 'ajv'
import ts from 'typescript'

const packageRoot = path.resolve(import.meta.dirname, '..')
const inventory = JSON.parse(await readFile(path.join(packageRoot, 'api-inventory.json'), 'utf8'))
const schema = JSON.parse(await readFile(path.join(packageRoot, 'api-inventory.schema.json'), 'utf8'))

const validate = new Ajv({allowUnionTypes: true}).compile(schema)
if (!validate(inventory)) {
  // eslint-disable-next-line no-console
  console.error('api-inventory.json does not match its schema:')
  for (const error of validate.errors ?? []) {
    // eslint-disable-next-line no-console
    console.error(`  ${error.instancePath || '/'} ${error.message}`)
  }
  process.exit(1)
}

const sourceFiles = Object.values(inventory.upstream).map(source => path.resolve(packageRoot, source))
const program = ts.createProgram(sourceFiles, {
  allowJs: true,
  jsx: ts.JsxEmit.Preserve,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  skipLibCheck: true,
})
const checker = program.getTypeChecker()

function getValueExports(sourceFilePath) {
  const sourceFile = program.getSourceFile(sourceFilePath)
  const moduleSymbol = sourceFile && checker.getSymbolAtLocation(sourceFile)
  if (!moduleSymbol) {
    throw new Error(`Could not inspect exports from ${sourceFilePath}`)
  }

  return checker
    .getExportsOfModule(moduleSymbol)
    .filter(symbol => {
      const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol
      return Boolean(target.flags & ts.SymbolFlags.Value)
    })
    .map(symbol => symbol.getName())
}

const upstreamExports = new Set(sourceFiles.flatMap(getValueExports))
const manifestNames = [
  ...inventory.included.map(entry => entry.name),
  ...inventory.excluded.map(entry => entry.name),
  ...inventory.notRequired,
]
const classifiedNames = [
  ...inventory.included.filter(entry => entry.rootExport !== false).map(entry => entry.name),
  ...inventory.excluded.map(entry => entry.name),
  ...inventory.notRequired,
]
const classified = new Set(classifiedNames)
const duplicates = manifestNames.filter((name, index) => manifestNames.indexOf(name) !== index)
const missing = [...upstreamExports].filter(name => !classified.has(name)).sort()
const stale = [...classified].filter(name => !upstreamExports.has(name) && name !== 'SelectPanel2').sort()

if (duplicates.length || missing.length || stale.length) {
  // eslint-disable-next-line no-console
  console.error(
    JSON.stringify(
      {
        duplicates: [...new Set(duplicates)].sort(),
        missing,
        stale,
      },
      null,
      2,
    ),
  )
  process.exitCode = 1
}
