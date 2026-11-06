import {mkdir, readFile, writeFile} from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import glob from 'fast-glob'

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
  const docs = JSON.parse(await readFile(docsPath, 'utf8'))
  components.push({name, intent, notes: readMigrationNotes(alignment), docs})
}

if (problems.length > 0) {
  // eslint-disable-next-line no-console
  console.error(problems.map(problem => `  ${problem}`).join('\n'))
  process.exit(1)
}

// AGENTS.md is the authored guidance; llms.txt republishes it with a generated component index.
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

function renderComponent({name, intent, notes, docs}) {
  const imports = (docs?.exports ?? [name]).join(', ')
  const lines = [
    `# ${name}`,
    '',
    intent,
    '',
    `Import: \`import {${imports}} from '@primer/react-tailwind/${name}'\``,
    '',
  ]

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

  // Trimmed so generated output already matches Prettier and check:llms cannot fight format:diff.
  return `${lines.join('\n').trimEnd()}\n`
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

const files = new Map([
  ['llms.txt', `${lines.join('\n')}\n`],
  ...components.map(component => [`llms/${component.name}.md`, renderComponent(component)]),
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
    console.log(`llms.txt and ${components.length} component files are up to date.`)
  }
} else {
  await mkdir(path.join(outputRoot, 'llms'), {recursive: true})
  for (const [file, content] of files) {
    await writeFile(path.join(outputRoot, file), content)
  }
  // eslint-disable-next-line no-console
  console.log(`Generated llms.txt index and ${components.length} component files.`)
}
