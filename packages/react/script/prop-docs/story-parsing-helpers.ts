import generate from '@babel/generator'
import {parse} from '@babel/parser'
import traverse from '@babel/traverse'
import type {ArrowFunctionExpression, Identifier, FunctionDeclaration} from '@babel/types'
import {pascalCase, kebabCase} from 'change-case'
import fs from 'fs'
import prettier from '@prettier/sync'

const storyPrefix = {
  draft: 'drafts-',
  experimental: 'experimental-',
  deprecated: 'deprecated-',
  alpha: '',
  beta: '',
  stable: '',
}

// TODO: update the `.replace` regex that will work for cases like ActionList
// where the file is named `List.tsx` and the component is named `ActionList`.
export function getStoryData(docgenData) {
  const {displayName, filePath, tags} = docgenData
  const {alias, primerstatus, primerstories} = tags

  // Get path to default story file
  // Example: src/components/Box/Box.docs.json -> src/components/Box/Box.stories.tsx
  const defaultStoryFilepath = filePath.replace(/\.tsx$/, '.stories.tsx')
  const componentName = alias || displayName

  // Get the default story id
  const defaultStoryId = `${storyPrefix[primerstatus]}components-${String(componentName).toLowerCase()}--default`

  // Get source code for default story
  const {Default: defaultStoryCode} = getStorySourceCode(defaultStoryFilepath)

  // Get path to feature story file
  // Example: src/components/Box/Box.docs.json -> src/components/Box/Box.features.stories.tsx
  const featureStoryFilepath = filePath.replace(/\.tsx$/, '.features.stories.tsx')
  const exampleStoryFilepath = filePath.replace(/\.tsx$/, '.examples.stories.tsx')

  // Get source code for each feature story
  const featureStorySourceCode = getStorySourceCode(featureStoryFilepath)
  const exampleStorySourceCode = getStorySourceCode(exampleStoryFilepath)

  // Populate source code for each feature story
  // if stories are not defined in *.docs.json, fill feature stories as default
  const stories = (
    primerstories && primerstories.split(' ').length > 0
      ? primerstories.split(' ').map(id => ({id}))
      : getStoryIds({status: primerstatus, name: componentName}, Object.keys(featureStorySourceCode))
  )
    // Filter out the default story
    .filter(({id}) => id !== defaultStoryId)
    .map(({id}) => {
      const storyName = getStoryName(id)
      const code = id.includes('-features--') ? featureStorySourceCode[storyName] : exampleStorySourceCode[storyName]

      if (!code) {
        throw new Error(
          `Invalid story id "${id}" parsed from ${filePath}. No story named "${storyName}" found in ${featureStoryFilepath}`,
        )
      }

      return {id, code}
    })

  // Add default story to the beginning of the array
  if (defaultStoryCode) {
    stories.unshift({
      id: defaultStoryId,
      code: defaultStoryCode,
    })
  }

  if (stories.length === 0) {
    console.log(
      `No stories found for ${componentName}. Checked for: \n Default story path: ${defaultStoryFilepath}. \n Feature story path: ${featureStoryFilepath}. \n Example story path: ${exampleStoryFilepath}`,
    )
  }

  return stories
}

// -----------------------------------------------------------------------------
// Helper functions
// -----------------------------------------------------------------------------

/**
 * Returns an object mapping story names to their source code
 *
 * @example
 * getStorySourceCode('src/components/Button/Button.stories.tsx')
 * // {Default: '<Button>Button</Button>'}
 */
export function getStorySourceCode(filepath: string) {
  if (!fs.existsSync(filepath)) {
    return {}
  }

  const code = fs.readFileSync(filepath, 'utf-8')

  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })

  const stories: Record<string, string> = {}

  traverse(ast, {
    ExportNamedDeclaration(path) {
      const varDeclaration = path.node.declaration

      let id: Identifier
      let func: ArrowFunctionExpression | FunctionDeclaration

      if (varDeclaration?.type === 'VariableDeclaration') {
        id = varDeclaration.declarations[0].id as Identifier
        const init = varDeclaration.declarations[0].init
        if (init?.type === 'ArrowFunctionExpression') func = init
        else return // not a function = not story
      } else if (varDeclaration?.type === 'FunctionDeclaration') {
        id = varDeclaration.id as Identifier
        func = varDeclaration
      } else {
        return // not a function = not story
      }

      const code = prettier
        .format(generate(func).code, {
          parser: 'typescript',
          singleQuote: true,
          trailingComma: 'all',
          semi: false,
        })
        .trim()
        .replace(/;$/, '')
        .replace(/^;/, '')

      const name = id.name
      stories[name] = code
    },
  })

  return stories
}

export function getStoryName(id: string) {
  const parts = id.split('--')
  return pascalCase(parts[parts.length - 1])
}

export function getStoryIds(docs: any, storyNames: string[]) {
  const ids = storyNames.map(
    storyName =>
      `${storyPrefix[docs.status]}components-${String(docs.name).toLowerCase()}-features--${kebabCase(storyName)}`,
  )

  return ids.map(id => ({id}))
}
