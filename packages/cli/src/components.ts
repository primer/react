import {existsSync, readdirSync, readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {formatKeyValueTable, formatTable} from './table.js'

interface ComponentProp {
  readonly name: string
  readonly type?: string
  readonly required?: boolean
  readonly description?: string
  readonly defaultValue?: string
  readonly deprecated?: boolean
}

interface ComponentStory {
  readonly id: string
  readonly code?: string
}

interface ComponentPassthrough {
  readonly element: string
  readonly url: string
}

interface Component {
  readonly id: string
  readonly name: string
  readonly status?: string
  readonly importPath: string
  readonly source?: string
  readonly props?: readonly ComponentProp[]
  readonly stories?: readonly ComponentStory[]
  readonly passthrough?: ComponentPassthrough
}

interface ComponentsData {
  readonly components: Record<string, Component>
}

interface ComponentInfo {
  readonly component: Component
  readonly docsUrl: string
  readonly usageDocs: string
}

const require = createRequire(import.meta.url)

function listComponents(): readonly Component[] {
  return Object.values(loadComponentsData().components).sort((a, b) => {
    return a.name.localeCompare(b.name)
  })
}

function findComponent(name: string): Component | null {
  const normalizedName = normalizeIdentifier(name)
  return (
    listComponents().find(component => {
      return (
        normalizeIdentifier(component.name) === normalizedName ||
        normalizeIdentifier(component.id) === normalizedName ||
        normalizeIdentifier(idToSlug(component.id)) === normalizedName
      )
    }) ?? null
  )
}

async function getComponentInfo(name: string): Promise<ComponentInfo | null> {
  const component = findComponent(name)
  if (!component) {
    return null
  }

  const docsUrl = new URL(`/product/components/${idToSlug(component.id)}/llms.txt`, 'https://primer.style')
  let usageDocs = `Usage documentation is available at ${docsUrl.toString()}`

  try {
    const response = await fetch(docsUrl)
    if (response.ok) {
      usageDocs = await response.text()
    } else {
      usageDocs = `Unable to fetch ${docsUrl.toString()} (${response.status} ${response.statusText}). ${usageDocs}`
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    usageDocs = `Unable to fetch ${docsUrl.toString()} (${message}). ${usageDocs}`
  }

  return {
    component,
    docsUrl: docsUrl.toString(),
    usageDocs,
  }
}

function formatComponentList(components: readonly Component[]): string {
  return formatTable(components, [
    {
      header: 'Name',
      getValue: component => component.name,
    },
    {
      header: 'ID',
      getValue: component => component.id,
    },
    {
      header: 'Import path',
      getValue: component => component.importPath,
    },
    {
      header: 'Status',
      getValue: component => component.status,
    },
  ])
}

function formatComponentInfo(info: ComponentInfo): string {
  const {component} = info
  const props = component.props ?? []
  const stories = component.stories ?? []
  const metadata = formatKeyValueTable([
    ['Name', component.name],
    ['ID', component.id],
    ['Import path', component.importPath],
    ['Status', component.status],
    ['Source', component.source],
    ['Docs', info.docsUrl],
    [
      'Passthrough element',
      component.passthrough ? `${component.passthrough.element} (${component.passthrough.url})` : undefined,
    ],
  ])

  const api = props.length > 0 ? formatProps(props) : 'No API metadata is available for this component.'
  const storyList =
    stories.length > 0
      ? formatTable(stories, [
          {
            header: 'Story',
            getValue: story => story.id,
          },
        ])
      : 'No Storybook story metadata is available for this component.'

  return `# ${component.name}

## Component

${metadata}

## Usage docs

${formatKeyValueTable([['Usage docs', info.usageDocs]])}

## API

${api}

## Stories

${storyList}
`
}

function formatProps(props: readonly ComponentProp[]): string {
  return formatTable(props, [
    {
      header: 'Prop',
      getValue: prop => prop.name,
    },
    {
      header: 'Type',
      getValue: prop => prop.type,
    },
    {
      header: 'Required',
      getValue: prop => (prop.required ? 'Yes' : 'No'),
    },
    {
      header: 'Deprecated',
      getValue: prop => (prop.deprecated ? 'Yes' : 'No'),
    },
    {
      header: 'Default',
      getValue: prop => prop.defaultValue,
    },
    {
      header: 'Description',
      getValue: prop => prop.description,
    },
  ])
}

function loadComponentsData(): ComponentsData {
  try {
    const componentsPath = require.resolve('@primer/react/generated/components.json')
    return JSON.parse(readFileSync(componentsPath, 'utf-8')) as ComponentsData
  } catch {
    return loadComponentsDataFromSource()
  }
}

function loadComponentsDataFromSource(): ComponentsData {
  const repoRoot = findRepositoryRoot()
  if (!repoRoot) {
    throw new Error('Unable to find @primer/react generated metadata or local source metadata.')
  }

  const reactRoot = path.join(repoRoot, 'packages/react')
  const sourceRoot = path.join(reactRoot, 'src')
  const docsFiles = collectFiles(sourceRoot, '.docs.json')
  const components: Record<string, Component> = {}

  for (const file of docsFiles) {
    const component = JSON.parse(readFileSync(file, 'utf-8')) as Component
    const relativePath = path.relative(reactRoot, path.dirname(file))
    components[component.id] = {
      source: `https://github.com/primer/react/tree/main/packages/react/${relativePath}`,
      ...component,
    }
  }

  return {components}
}

function collectFiles(directory: string, suffix: string): string[] {
  if (!existsSync(directory)) {
    return []
  }

  const files: string[] = []
  for (const entry of readdirSync(directory, {withFileTypes: true})) {
    const filepath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectFiles(filepath, suffix))
    } else if (entry.isFile() && entry.name.endsWith(suffix)) {
      files.push(filepath)
    }
  }

  return files
}

function findRepositoryRoot(): string | null {
  let directory = path.dirname(fileURLToPath(import.meta.url))

  while (directory !== path.dirname(directory)) {
    const packageJsonPath = path.join(directory, 'package.json')
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as {name?: string}
      if (packageJson.name === 'primer') {
        return directory
      }
    }

    directory = path.dirname(directory)
  }

  return null
}

function idToSlug(id: string): string {
  if (id === 'actionbar') {
    return 'action-bar'
  }

  if (id === 'tooltip-v2') {
    return 'tooltip'
  }

  if (id === 'dialog_v2') {
    return 'dialog'
  }

  return id.replaceAll('_', '-')
}

function normalizeIdentifier(value: string): string {
  return value.toLowerCase().replaceAll(/[\s_-]/g, '')
}

export {findComponent, formatComponentInfo, formatComponentList, getComponentInfo, listComponents}
export type {Component}
