import {readFile} from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import {execFileSync} from 'node:child_process'

const packageRoot = path.resolve(import.meta.dirname, '..')
const outputPath = path.join(packageRoot, 'llms.txt')

const before = await readFile(outputPath, 'utf8').catch(() => undefined)

execFileSync(process.execPath, [path.join(packageRoot, 'script', 'generate-llms-txt.mjs')], {stdio: 'inherit'})

const after = await readFile(outputPath, 'utf8')

if (before !== after) {
  // eslint-disable-next-line no-console
  console.error('llms.txt is out of date. Run `npm run build:llms -w @primer/react-tailwind` and commit the result.')
  process.exit(1)
}
