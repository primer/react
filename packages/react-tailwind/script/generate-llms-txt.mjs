import {mkdir, readFile, writeFile} from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import glob from 'fast-glob'
import {format, resolveConfig} from 'prettier'
import {readComponentGuide} from './component-guide.mjs'

const packageRoot = path.resolve(import.meta.dirname, '..')
let outputRoot = packageRoot
let checkOnly = false

for (let i = 0; i < process.argv.slice(2).length; i++) {
  const argument = process.argv[i + 2]
  if (argument === '--check') {
    checkOnly = true
  } else if (argument === '--output-dir' && process.argv[i + 3] && !process.argv[i + 3].startsWith('--')) {
    outputRoot = path.resolve(process.argv[i + 3])
    i++
  } else {
    throw new Error(`Unknown or incomplete argument: ${argument}`)
  }
}

/** The first paragraph after a document's heading, used as the component's intent line. */
function readIntent(source, name) {
  const match = new RegExp(`^# ${name}\\n\\n(.+?)\\n`, 'ms').exec(source)
  return match?.[1].trim()
}

function readMigrationNotes(source) {
  const section = /^## Migration notes\n\n([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(source)
  if (!section) return []
  // A note keeps its indented continuation blocks (tables, code, nested lists) so nothing it refers to is dropped.
  const notes = []
  for (const line of section[1].split('\n')) {
    if (line.startsWith('- ')) notes.push([line.slice(2).trim()])
    else if (notes.length > 0 && (line.startsWith('  ') || line.trim() === '')) notes.at(-1).push(line.trimEnd())
  }
  return notes.map(note => note.join('\n').trimEnd())
}

const inventory = JSON.parse(await readFile(path.join(packageRoot, 'api-inventory.json'), 'utf8'))
const metadata = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'))
const {version} = metadata
const agents = await readFile(path.join(packageRoot, 'AGENTS.md'), 'utf8')

const componentDirectories = (await glob('src/components/*/index.ts', {cwd: packageRoot, absolute: true})).sort(
  (first, second) => first.localeCompare(second),
)

const problems = []
const components = []

for (const file of ['AGENTS.md', 'llms.txt', 'llms/*.md', 'api-inventory.json', 'api-inventory.schema.json']) {
  if (metadata.exports?.[`./${file}`] !== `./${file}`) {
    problems.push(`package.json must explicitly export "./${file}" as "./${file}" for documentation retrieval.`)
  }
  if (!metadata.files?.includes(file.split('/')[0])) {
    problems.push(`package.json files must include "${file.split('/')[0]}" for documentation delivery.`)
  }
}

for (const entryPath of componentDirectories) {
  const directory = path.dirname(entryPath)
  const name = path.basename(directory)
  const sources = {}
  for (const file of ['README.mdx', 'ALIGNMENT.md', `${name}.docs.json`]) {
    try {
      sources[file] = await readFile(path.join(directory, file), 'utf8')
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
      problems.push(`${name}: missing ${file}. Every public component directory needs consumer guidance.`)
    }
  }
  if (Object.keys(sources).length !== 3) continue
  const readme = sources['README.mdx']
  const intent = readIntent(readme, name)

  if (!intent) {
    problems.push(`${name}: README.mdx has no intent paragraph directly after its "# ${name}" heading.`)
    continue
  }

  if (/is a Tailwind React component\. Import it from/.test(intent)) {
    problems.push(`${name}: README.mdx intent is boilerplate and does not explain when to use the component.`)
    continue
  }

  const alignment = sources['ALIGNMENT.md']
  const docs = JSON.parse(sources[`${name}.docs.json`])
  components.push({
    name,
    intent,
    guide: readComponentGuide(readme, name, problems),
    notes: readMigrationNotes(alignment),
    docs,
  })
}

const themeGuide = await readFile(path.join(packageRoot, 'src/docs/ThemeProvider/GUIDE.md'), 'utf8')
const themeIntent = readIntent(themeGuide, 'ThemeProvider and useTheme')
if (!themeIntent) {
  problems.push('ThemeProvider: GUIDE.md has no intent paragraph directly after its heading.')
}

const baseStylesReadme = await readFile(path.join(packageRoot, 'src/docs/BaseStyles/README.mdx'), 'utf8')
const baseStylesIntent = readIntent(baseStylesReadme, 'BaseStyles')
if (!baseStylesIntent) problems.push('BaseStyles: README.mdx has no intent paragraph directly after its heading.')
const baseStylesSections = readComponentGuide(baseStylesReadme, 'BaseStyles', problems)
const baseStylesGuide = [
  '# BaseStyles',
  '',
  baseStylesIntent,
  '',
  "Import: `import {BaseStyles} from '@primer/react-tailwind'`. There is no supported BaseStyles component subpath.",
  '',
  'Read [package guidance](../AGENTS.md) for shared setup and styling contracts.',
  '',
  ...baseStylesSections.flatMap(({heading, text}) => [`## ${heading}`, '', text, '']),
].join('\n')

const documentedExports = new Set([
  'BaseStyles',
  'ThemeProvider',
  ...components.flatMap(({name, docs}) => docs.exports ?? [name]),
])
for (const entry of inventory.included ?? []) {
  if (
    entry.rootExport !== false &&
    ['component', 'provider'].includes(entry.kind) &&
    !documentedExports.has(entry.name)
  ) {
    problems.push(`${entry.name}: public ${entry.kind} has no installed component or foundation guide.`)
  }
}

if (problems.length > 0) {
  // eslint-disable-next-line no-console
  console.error(problems.map(problem => `  ${problem}`).join('\n'))
  process.exit(1)
}

// AGENTS.md is the authored guidance; llms.txt republishes it with component and foundation indexes.
const guidance = agents.replace(/^# .*\n\n/, '').trimEnd()

/** Renders one prop row, keeping the table narrow enough to stay readable as plain text. */
function propLine({name, type, defaultValue, description, required}) {
  const head = `- ${codeSpan(name)}${required ? ' (required)' : ''}: ${codeSpan(type)}`
  // A description keeps its source line wrapping, which would break the bullet it renders into.
  const prose = description?.replace(/\s+/g, ' ').trim()
  const tail = [defaultValue ? `Default ${codeSpan(defaultValue)}.` : undefined, prose].filter(Boolean).join(' ')
  return tail ? `${head} — ${tail}` : head
}

function codeSpan(value) {
  const longestRun = Math.max(0, ...Array.from(value.matchAll(/`+/g), match => match[0].length))
  const fence = '`'.repeat(longestRun + 1)
  const pad = longestRun > 0 ? ' ' : ''
  return `${fence}${pad}${value}${pad}${fence}`
}

/** Names the HTML element or Base UI part a component forwards unrecognized props to. */
function passthroughLine({element, url}) {
  if (new URL(url).hostname === 'base-ui.com') {
    return `Forwards unrecognized props to Base UI's [\`${element}\`](${url}), so it also accepts that part's props.`
  }
  const article = /^[aeiou]/.test(element) ? 'an' : 'a'
  return `Renders ${article} [\`<${element}>\`](${url}) and forwards unrecognized props to it, so it also accepts that element's native attributes.`
}

function renderComponent({name, intent, guide, notes, docs}) {
  const imports = (docs?.exports ?? [name]).join(', ')
  const lines = [
    `# ${name}`,
    '',
    intent,
    '',
    `Import: \`import {${imports}} from '@primer/react-tailwind/${name}'\``,
    '',
    'Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.',
    '',
  ]

  for (const section of guide) {
    lines.push(`## ${section.heading}`, '', section.text, '')
  }

  if (docs?.passthrough) lines.push(passthroughLine(docs.passthrough), '')

  if (docs?.props?.length) {
    lines.push('## Props', '', ...docs.props.map(propLine), '')
  }

  // Every part gets a section, so a reader learns it exists even when it takes no props of its own.
  for (const sub of docs?.subcomponents ?? []) {
    lines.push(`## ${sub.name}`, '')
    if (sub.passthrough) lines.push(passthroughLine(sub.passthrough), '')
    if (sub.props?.length) lines.push(...sub.props.map(propLine), '')
    else if (!sub.passthrough) lines.push('Takes no props of its own.', '')
  }

  if (notes.length > 0) {
    lines.push('## Differences from `@primer/react`', '', ...notes.map(note => `- ${note}`), '')
  }

  return `${lines.join('\n').trimEnd()}\n`
}

// llms.txt stays an index so an agent can load guidance plus one focused guide, not all of them.
const lines = [
  `# @primer/react-tailwind ${version}`,
  '',
  '> Primer design system components implemented with Tailwind CSS and Base UI. This file is generated; do not edit it by hand.',
  '',
  guidance,
  '',
  '## Foundations',
  '',
  `- [BaseStyles](llms/BaseStyles.md): ${baseStylesIntent}`,
  `- [ThemeProvider and useTheme](llms/ThemeProvider.md): ${themeIntent}`,
  '',
  '## Components',
  '',
  'Each component has a detail file with usage examples, composition and state contracts, props, accessibility guidance, and migration notes. Load only the ones you need.',
  '',
  ...components.map(({name, intent}) => `- [${name}](llms/${name}.md): ${intent}`),
  '',
  '## Not included',
  '',
  ...inventory.excluded.map(entry => `- \`${entry.name}\` (${entry.reason}). ${entry.replacement}`),
  '',
]

// Detail files are formatted here so check:llms and format:diff agree, including on copied tables.
const prettierOptions = {...(await resolveConfig(path.join(packageRoot, 'llms/index.md'))), parser: 'markdown'}
const files = new Map([
  ['llms.txt', `${lines.join('\n')}\n`],
  ['llms/BaseStyles.md', await format(baseStylesGuide, prettierOptions)],
  ['llms/ThemeProvider.md', await format(themeGuide, prettierOptions)],
  ...(await Promise.all(
    components.map(async component => [
      `llms/${component.name}.md`,
      await format(renderComponent(component), prettierOptions),
    ]),
  )),
])

if (checkOnly) {
  const existingDetails = await glob('llms/*.md', {cwd: outputRoot})
  const paths = new Set([...files.keys(), ...existingDetails])
  const stale = []

  for (const file of paths) {
    let actual
    try {
      actual = await readFile(path.join(outputRoot, file), 'utf8')
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
    if (actual !== files.get(file)) stale.push(file)
  }

  if (stale.length > 0) {
    // eslint-disable-next-line no-console
    console.error(
      `Generated llms files are out of date. Run \`npm run build:llms -w @primer/react-tailwind\` and remove obsolete files:\n${stale
        .sort()
        .map(file => `  ${file}`)
        .join('\n')}`,
    )
    process.exitCode = 1
  } else {
    // eslint-disable-next-line no-console
    console.log(`llms.txt, ${components.length} component files, and 2 foundation guides are up to date.`)
  }
} else {
  await mkdir(path.join(outputRoot, 'llms'), {recursive: true})
  for (const [file, content] of files) {
    await writeFile(path.join(outputRoot, file), content)
  }
  // eslint-disable-next-line no-console
  console.log(`Generated llms.txt index, ${components.length} component files, and 2 foundation guides.`)
}
