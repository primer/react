import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {parseTypeInfo, readPassthroughElement, simplifyReactType} from '@primer/doc-gen'
import glob from 'fast-glob'
import {storyNameFromExport, toId} from 'storybook/internal/csf'
import ts from 'typescript'

const packageDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/** Region props come from the `RegionProps<Names>` mapped type, which carries no per-property JSDoc. */
function regionDescription(owner, region) {
  const part = region[0].toUpperCase() + region.slice(1)
  return `Supplies the ${region} region. Takes precedence over a matching \`${owner}.${part}\` child.`
}

/**
 * TypeScript is the source of truth for a prop's type, but the checker only sees the flattened
 * props object. Region names, default values, and the base DOM element are declared in syntax
 * it has already erased, so those are read from the source text as well.
 */
function readSourceFacts(filePath) {
  const text = fs.readFileSync(filePath, 'utf8')
  const source = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const regions = new Map()
  const passthrough = new Map()
  const defaults = new Map()

  const visit = node => {
    if ((ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) && node.name.text.endsWith('Props')) {
      // An interface names its bases in heritage clauses; a type alias is the base itself.
      const heritage = ts.isInterfaceDeclaration(node)
        ? (node.heritageClauses ?? []).map(clause => clause.getText()).join(' ')
        : node.type.getText()

      const names = []
      for (const clause of ts.isInterfaceDeclaration(node) ? (node.heritageClauses ?? []) : []) {
        for (const type of clause.types) {
          if (type.expression.getText() !== 'RegionProps') continue
          for (const argument of type.typeArguments ?? []) {
            for (const literal of argument.types ?? [argument]) {
              if (ts.isLiteralTypeNode(literal) && ts.isStringLiteral(literal.literal)) names.push(literal.literal.text)
            }
          }
        }
      }
      if (names.length > 0) regions.set(node.name.text, names)

      const element = readPassthroughElement(heritage)
      if (element) passthrough.set(node.name.text, element)
    }

    if (ts.isObjectBindingPattern(node)) {
      for (const element of node.elements) {
        if (!element.initializer || !ts.isIdentifier(element.name)) continue
        const key = (element.propertyName ?? element.name).getText().replace(/['"]/g, '')
        if (!defaults.has(key)) defaults.set(key, element.initializer.getText())
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(source)
  return {regions, passthrough, defaults}
}

/** Story ids are derived with Storybook's own `toId`, so they cannot drift from what it registers. */
function readStoryIds(directory) {
  const ids = []
  for (const file of glob.sync('*.stories.tsx', {cwd: directory, absolute: true}).sort()) {
    const text = fs.readFileSync(file, 'utf8')
    const title = /title:\s*'([^']+)'/.exec(text)?.[1]
    if (!title) continue
    for (const match of text.matchAll(/^export const (\w+)\s*[:=]/gm)) {
      if (match[1] === 'default') continue
      ids.push({id: toId(title, storyNameFromExport(match[1]))})
    }
  }
  return ids.length > 0 ? ids : undefined
}

function toProp(name, info, defaults) {
  const prop = {name, type: simplifyReactType(info.type)}
  const defaultValue = info.defaultValue ?? defaults.get(name)
  if (defaultValue !== undefined) prop.defaultValue = defaultValue
  if (info.required) prop.required = true
  if (info.description) prop.description = info.description
  return prop
}

function byName(first, second) {
  return first.name.localeCompare(second.name)
}

export function buildDocs(componentName) {
  const directory = path.join(packageDirectory, 'src/components', componentName)
  const sources = glob
    .sync('*.{ts,tsx}', {cwd: directory, absolute: true})
    .filter(file => !/\.(test|stories|storyHelpers)\./.test(file) && !file.endsWith('index.ts'))
    .sort()

  const regions = new Map()
  const passthrough = new Map()
  const defaults = new Map()
  for (const file of sources) {
    const facts = readSourceFacts(file)
    for (const [key, value] of facts.regions) if (!regions.has(key)) regions.set(key, value)
    for (const [key, value] of facts.passthrough) if (!passthrough.has(key)) passthrough.set(key, value)
    for (const [key, value] of facts.defaults) if (!defaults.has(key)) defaults.set(key, value)
  }

  let parsed
  try {
    parsed = parseTypeInfo(path.relative(packageDirectory, directory), componentName)
  } catch {
    parsed = undefined
  }

  const readme = path.join(directory, 'README.mdx')
  const intent = fs.existsSync(readme)
    ? new RegExp(`^# ${componentName}\\n\\n(.+?)\\n`, 'ms').exec(fs.readFileSync(readme, 'utf8'))?.[1].trim()
    : undefined

  const docs = {
    id: componentName.toLowerCase(),
    name: componentName,
    status: 'alpha',
    importPath: `@primer/react-tailwind/${componentName}`,
  }
  if (intent) docs.description = intent

  const stories = readStoryIds(directory)
  if (stories) docs.stories = stories

  if (parsed) {
    const props = Object.entries(parsed.props)
      .map(([name, info]) => toProp(name, info, defaults))
      .filter(prop => prop.name !== 'key')

    for (const region of regions.get(`${componentName}Props`) ?? []) {
      const description = regionDescription(componentName, region)
      const existing = props.find(prop => prop.name === region)
      if (existing) existing.description ||= description
      else props.push({name: region, type: 'React.ReactNode', description})
    }

    if (props.length > 0) docs.props = props.sort(byName)

    const subcomponents = Object.entries(parsed.subComponents ?? {})
      .map(([name, info]) => {
        const props = Object.entries(info.props)
          .map(([propName, propInfo]) => toProp(propName, propInfo, defaults))
          .filter(prop => prop.name !== 'key')

        // A part declares its own regions, so look them up under the part's props type.
        const owner = `${componentName}.${name}`
        for (const region of regions.get(`${componentName}${name}Props`) ?? regions.get(`${name}Props`) ?? []) {
          const description = regionDescription(owner, region)
          const existing = props.find(prop => prop.name === region)
          if (existing) existing.description ||= description
          else props.push({name: region, type: 'React.ReactNode', description})
        }

        return {name, props: props.sort(byName)}
      })
      .filter(entry => entry.props.length > 0)
    if (subcomponents.length > 0) docs.subcomponents = subcomponents
  }

  const element = passthrough.get(`${componentName}Props`)
  if (element) {
    docs.passthrough = {
      element,
      url: `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/${element}#attributes`,
    }
  }

  return docs
}

if (import.meta.filename === process.argv[1]) {
  const only = process.argv.slice(2).filter(argument => !argument.startsWith('--'))
  const components = glob
    .sync('src/components/*/README.mdx', {cwd: packageDirectory})
    .map(file => path.basename(path.dirname(file)))
    .filter(name => only.length === 0 || only.includes(name))
    .sort()

  const unresolved = []
  for (const name of components) {
    const docs = buildDocs(name)
    if (!docs.props) unresolved.push(name)
    const target = path.join(packageDirectory, 'src/components', name, `${name}.docs.json`)
    fs.writeFileSync(target, `${JSON.stringify(docs, null, 2)}\n`)
  }

  // eslint-disable-next-line no-console
  console.log(`Generated docs.json for ${components.length} component(s).`)
  if (unresolved.length > 0) {
    // eslint-disable-next-line no-console
    console.log(`  TypeScript resolved no props for: ${unresolved.join(', ')}`)
  }
}
