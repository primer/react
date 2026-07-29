import {existsSync} from 'node:fs'
import {mkdir, readFile, rm, writeFile} from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import glob from 'fast-glob'

const packageRoot = path.resolve(import.meta.dirname, '..')
const outputPath = path.join(packageRoot, 'llms.txt')

/** The first paragraph after a document's heading, used as the component's intent line. */
function readIntent(source, name) {
  const match = new RegExp(`^# ${name}\\n\\n(.+?)\\n`, 'ms').exec(source)
  return match?.[1].trim()
}

function readMigrationNotes(source) {
  const section = /^## Migration notes\n\n([\s\S]*?)(?=\n## |$)/m.exec(source)
  if (!section) return []
  return section[1]
    .split('\n')
    .filter(line => line.startsWith('- '))
    .map(line => line.slice(2).trim())
}

const inventory = JSON.parse(await readFile(path.join(packageRoot, 'api-inventory.json'), 'utf8'))
const {version} = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'))
const agents = await readFile(path.join(packageRoot, 'AGENTS.md'), 'utf8')

const componentDirectories = (await glob('src/components/*/README.mdx', {cwd: packageRoot, absolute: true})).sort(
  (first, second) => first.localeCompare(second),
)

const problems = []
const components = []

for (const readmePath of componentDirectories) {
  const directory = path.dirname(readmePath)
  const name = path.basename(directory)
  const readme = await readFile(readmePath, 'utf8')
  const intent = readIntent(readme, name)

  if (!intent) {
    problems.push(`${name}: README.mdx has no intent paragraph directly after its "# ${name}" heading.`)
    continue
  }

  if (/is a Tailwind React component\. Import it from/.test(intent)) {
    problems.push(`${name}: README.mdx intent is boilerplate and does not explain when to use the component.`)
    continue
  }

  const alignment = await readFile(path.join(directory, 'ALIGNMENT.md'), 'utf8')
  const docsPath = path.join(directory, `${name}.docs.json`)
  const docs = existsSync(docsPath) ? JSON.parse(await readFile(docsPath, 'utf8')) : null
  components.push({name, intent, notes: readMigrationNotes(alignment), docs})
}

if (problems.length > 0) {
  // eslint-disable-next-line no-console
  console.error(problems.map(problem => `  ${problem}`).join('\n'))
  process.exit(1)
}

// AGENTS.md is the authored guidance; llms.txt republishes it with a generated component index.
const guidance = agents.replace(/^# .*\n\n/, '').trimEnd()

const detailDirectory = path.join(packageRoot, 'llms')
await rm(detailDirectory, {recursive: true, force: true})
await mkdir(detailDirectory, {recursive: true})

/** Renders one prop row, keeping the table narrow enough to stay readable as plain text. */
function propLine({name, type, defaultValue, description}) {
  const head = `- \`${name}\`: \`${type}\``
  const tail = [defaultValue ? `Default \`${defaultValue}\`.` : undefined, description].filter(Boolean).join(' ')
  return tail ? `${head} — ${tail}` : head
}

function renderComponent({name, intent, notes, docs}) {
  const lines = [`# ${name}`, '', intent, '', `Import: \`import {${name}} from '@primer/react-tailwind/${name}'\``, '']

  if (docs?.props?.length) {
    lines.push('## Props', '', ...docs.props.map(propLine), '')
  }

  for (const sub of docs?.subcomponents ?? []) {
    if (!sub.props?.length) continue
    lines.push(`## ${sub.name} props`, '', ...sub.props.map(propLine), '')
  }

  if (notes.length > 0) {
    lines.push('## Differences from `@primer/react`', '', ...notes.map(note => `- ${note}`), '')
  }

  return `${lines.join('\n')}\n`
}

for (const component of components) {
  await writeFile(path.join(detailDirectory, `${component.name}.md`), renderComponent(component))
}

// llms.txt stays an index so an agent can load guidance plus one component, not all of them.
const lines = [
  `# @primer/react-tailwind ${version}`,
  '',
  '> Primer design system components implemented with Tailwind CSS and Base UI. This file is generated; do not edit it by hand.',
  '',
  guidance,
  '',
  '## Components',
  '',
  'Each component has a detail file with its props and migration notes. Load only the ones you need.',
  '',
  ...components.map(({name, intent}) => `- [${name}](llms/${name}.md): ${intent}`),
  '',
  '## Not included',
  '',
  ...inventory.excluded.map(entry => `- \`${entry.name}\` (${entry.reason}). ${entry.replacement}`),
  '',
]

await writeFile(outputPath, `${lines.join('\n')}\n`)

// eslint-disable-next-line no-console
console.log(`Generated llms.txt index and ${components.length} component files.`)
