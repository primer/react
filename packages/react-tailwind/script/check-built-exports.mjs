import {readFile} from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import {pathToFileURL} from 'node:url'

const packageRoot = path.resolve(import.meta.dirname, '..')
const inventoryPath = path.join(packageRoot, 'api-inventory.json')
const entryPath = path.join(packageRoot, 'dist', 'index.js')
const inventory = JSON.parse(await readFile(inventoryPath, 'utf8'))
const requiredExports = [
  ...new Set(inventory.included.filter(entry => entry.rootExport !== false).map(entry => entry.name)),
]

let builtModule
try {
  builtModule = await import(pathToFileURL(entryPath).href)
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(`Could not import the built package entry at ${entryPath}`)
  // eslint-disable-next-line no-console
  console.error(error)
  process.exitCode = 1
}

if (builtModule) {
  const actualExports = new Set(Object.keys(builtModule))
  const missingExports = requiredExports.filter(name => !actualExports.has(name))

  if (missingExports.length > 0) {
    // eslint-disable-next-line no-console
    console.error('Built API export check failed. Missing required root exports:')
    // eslint-disable-next-line no-console
    console.error(missingExports.map(name => `- ${name}`).join('\n'))
    process.exitCode = 1
  } else {
    // eslint-disable-next-line no-console
    console.log(`Built API export check passed (${requiredExports.length} required root exports).`)
  }
}
