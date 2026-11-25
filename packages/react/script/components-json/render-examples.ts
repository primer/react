import {capitalCase} from 'change-case'

type Story = {
  id: string
  code?: string
}

type Component = {
  name: string
  importPath: string
  stories: Array<Story>
}

function getFileName({name, importPath}: Component) {
  if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) {
    throw new Error(`Unsafe component name: ${JSON.stringify(name)}.`)
  }
  switch (importPath) {
    case '@primer/react':
      return `docs/components/${name}/examples.md`
    case '@primer/react/deprecated':
    case '@primer/react/experimental':
    case '@primer/react/next':
      return `docs/${importPath.slice('@primer/react/'.length)}/components/${name}/examples.md`
    default:
      throw new Error(`Unsupported component importPath: ${JSON.stringify(importPath)}.`)
  }
}

function codeFence(code: string) {
  const longest = Math.max(0, ...[...code.matchAll(/`+/g)].map(match => match[0].length))
  return '`'.repeat(Math.max(3, longest + 1))
}

export function renderExamples(component: Component) {
  const stories = component.stories.filter((story): story is Story & {code: string} => story.code !== undefined)
  if (!stories.length) {
    return null
  }

  const lines = [`# ${component.name} examples`, '']
  for (const story of stories) {
    const storyName = story.id.split('--').at(-1)
    if (!storyName) {
      throw new Error(`Invalid Storybook story ID: ${JSON.stringify(story.id)}.`)
    }
    const fence = codeFence(story.code)
    lines.push(`## ${capitalCase(storyName)}`, '', `${fence}tsx`, story.code, fence, '')
  }

  return {fileName: getFileName(component), source: lines.join('\n')}
}
