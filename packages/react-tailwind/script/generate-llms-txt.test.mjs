import assert from 'node:assert/strict'
import {execFileSync} from 'node:child_process'
import {copyFile, mkdir, mkdtemp, readFile, rm, writeFile} from 'node:fs/promises'
import path from 'node:path'
import {createRequire} from 'node:module'
import {test} from 'node:test'

const scriptDirectory = import.meta.dirname
const exports = Object.fromEntries(
  ['AGENTS.md', 'llms.txt', 'llms/*.md', 'api-inventory.json', 'api-inventory.schema.json'].map(file => [
    `./${file}`,
    `./${file}`,
  ]),
)

async function fixture(t) {
  const root = await mkdtemp(path.join(scriptDirectory, '.component-guidance-'))
  t.after(() => rm(root, {recursive: true, force: true}))
  for (const directory of ['script', 'src/components/Button', 'src/docs/ThemeProvider', 'src/docs/BaseStyles']) {
    await mkdir(path.join(root, directory), {recursive: true})
  }
  for (const file of ['generate-llms-txt.mjs', 'component-guide.mjs']) {
    await copyFile(path.join(scriptDirectory, file), path.join(root, 'script', file))
  }
  const files = {
    '.prettierrc.json': '{}',
    'package.json': JSON.stringify({
      name: '@primer/react-tailwind',
      type: 'module',
      version: '1.2.3',
      exports,
      files: ['AGENTS.md', 'llms.txt', 'llms', 'api-inventory.json', 'api-inventory.schema.json'],
    }),
    'AGENTS.md': '# Package guidance\n\nUse the installed docs.\n',
    'api-inventory.json': JSON.stringify({
      included: [
        {name: 'Button', kind: 'component'},
        {name: 'BaseStyles', kind: 'component'},
        {name: 'ThemeProvider', kind: 'provider'},
      ],
      excluded: [],
    }),
    'api-inventory.schema.json': '{}',
    'src/docs/ThemeProvider/GUIDE.md': '# ThemeProvider and useTheme\n\nConfigure a theme.\n',
    'src/docs/BaseStyles/README.mdx':
      '# BaseStyles\n\nProvides base styles.\n\n```tsx\nimport {BaseStyles} from "@primer/react-tailwind"\n;<BaseStyles />\n```\n',
    'src/components/Button/index.ts': 'export {Button} from "./Button"\n',
    'src/components/Button/README.mdx':
      '# Button\n\nTriggers an action.\n\n```tsx\n<Button>Save</Button>\n```\n\n' +
      '## Composition\nForward the ref.\n\n## Accessibility\nProvide a name.\n',
    'src/components/Button/ALIGNMENT.md':
      '# Alignment\n\n## Migration notes\n\n- Use className.\n  ```css\n  .custom { padding: 0; }\n  ```\n',
    'src/components/Button/Button.docs.json': JSON.stringify({
      exports: ['Button'],
      props: [{name: 'children', type: 'React.ReactNode'}],
    }),
  }
  for (const [file, contents] of Object.entries(files)) await writeFile(path.join(root, file), contents)
  return root
}

function generate(root, ...args) {
  return execFileSync(process.execPath, [path.join(root, 'script/generate-llms-txt.mjs'), ...args], {
    encoding: 'utf8',
    stdio: 'pipe',
  })
}

test('generates examples, contracts, props, nested migration notes and resolvable installed guides', async t => {
  const root = await fixture(t)
  generate(root)
  const require = createRequire(path.join(root, 'consumer.mjs'))
  const button = await readFile(require.resolve('@primer/react-tailwind/llms/Button.md'), 'utf8')
  assert.match(button, /<Button>Save<\/Button>/)
  assert.match(button, /## Composition\n\nForward the ref/)
  assert.match(button, /## Accessibility\n\nProvide a name/)
  assert.match(button, /## Props/)
  assert.match(button, /\.custom/)
  await readFile(require.resolve('@primer/react-tailwind/AGENTS.md'), 'utf8')
  const foundation = await readFile(require.resolve('@primer/react-tailwind/llms/BaseStyles.md'), 'utf8')
  assert.match(foundation, /import {BaseStyles} from '@primer\/react-tailwind'/)
  await readFile(require.resolve('@primer/react-tailwind/api-inventory.schema.json'), 'utf8')
  assert.match(generate(root, '--check'), /up to date/)
})

test('fails when an entry point has no README instead of omitting the component', async t => {
  const root = await fixture(t)
  await rm(path.join(root, 'src/components/Button/README.mdx'))
  assert.throws(
    () => generate(root),
    error => /Button: missing README.mdx/.test(String(error.stderr)),
  )
})

test('rejects undocumented public components and providers in the API inventory', async t => {
  const root = await fixture(t)
  await writeFile(
    path.join(root, 'api-inventory.json'),
    JSON.stringify({included: [{name: 'MissingProvider', kind: 'provider'}], excluded: []}),
  )
  assert.throws(
    () => generate(root),
    error => /MissingProvider: public provider has no/.test(String(error.stderr)),
  )
})

test('fails when a component has no rendered usage example', async t => {
  const root = await fixture(t)
  await writeFile(
    path.join(root, 'src/components/Button/README.mdx'),
    '# Button\n\nTriggers an action.\n\n```tsx\nimport {Button} from "@primer/react-tailwind"\n```\n',
  )
  assert.throws(
    () => generate(root),
    error => /needs a fenced usage example/.test(String(error.stderr)),
  )
})

test('rejects missing documentation exports and package files', async t => {
  const root = await fixture(t)
  const file = path.join(root, 'package.json')
  const metadata = JSON.parse(await readFile(file, 'utf8'))
  delete metadata.exports['./llms/*.md']
  metadata.files = metadata.files.filter(name => name !== 'AGENTS.md')
  await writeFile(file, JSON.stringify(metadata))
  assert.throws(
    () => generate(root),
    error => /must explicitly export/.test(String(error.stderr)) && /files must include/.test(String(error.stderr)),
  )
})

test('check mode rejects missing and stale guides as well as orphaned component files', async t => {
  const root = await fixture(t)
  generate(root)
  await writeFile(path.join(root, 'llms/Button.md'), 'stale')
  await writeFile(path.join(root, 'llms/Removed.md'), 'obsolete')
  await rm(path.join(root, 'llms/ThemeProvider.md'))
  assert.throws(
    () => generate(root, '--check'),
    error =>
      ['llms/Button.md', 'llms/Removed.md', 'llms/ThemeProvider.md'].every(file => String(error.stderr).includes(file)),
  )
  assert.equal(await readFile(path.join(root, 'llms/Button.md'), 'utf8'), 'stale')
})
