import {execFileSync} from 'node:child_process'
import {readFile} from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import glob from 'fast-glob'

const packageRoot = path.resolve(import.meta.dirname, '..')

const paths = glob.sync('src/components/*/*.docs.json', {absolute: true, cwd: packageRoot}).sort()
const before = new Map()
for (const file of paths) before.set(file, await readFile(file, 'utf8'))

execFileSync(process.execPath, [path.join(packageRoot, 'script', 'generate-docs-json.mjs')], {stdio: 'inherit'})

const after = glob.sync('src/components/*/*.docs.json', {absolute: true, cwd: packageRoot}).sort()
const stale = []

for (const file of after) {
  const current = await readFile(file, 'utf8')
  if (before.get(file) !== current) stale.push(path.relative(packageRoot, file))
}
for (const file of before.keys()) {
  if (!after.includes(file)) stale.push(path.relative(packageRoot, file))
}

if (stale.length > 0) {
  // eslint-disable-next-line no-console
  console.error(
    `${stale.length} docs.json file(s) are out of date. Run \`npm run build:docs-json -w @primer/react-tailwind\` and commit the result:`,
  )
  // eslint-disable-next-line no-console
  for (const file of stale) console.error(`  ${file}`)
  process.exit(1)
}

// eslint-disable-next-line no-console
console.log(`docs.json is up to date for ${after.length} components.`)
