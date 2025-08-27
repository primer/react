// @ts-expect-error there seems to be a mismatch in the types for this package
import {generate} from '@babel/generator'
import {parse} from '@babel/parser'
import {traverse} from '@babel/core'
import type {ArrowFunctionExpression, Identifier, FunctionDeclaration} from '@babel/types'
import path from 'node:path'
import {parseArgs} from 'node:util'
import Ajv from 'ajv'
import {pascalCase, kebabCase} from 'change-case'
import glob from 'fast-glob'
import fs from 'fs'
import keyBy from 'lodash.keyby'
import prettier from '@prettier/sync'
import chalk from 'chalk'
import type {LintError} from 'markdownlint'
import {lint as mdLint} from 'markdownlint/sync'
import componentSchema from './component.schema.json'
import outputSchema from './output.schema.json'

const args = parseArgs({
  options: {
    'storybook-data': {
      type: 'string',
    },
  },
})

// Only includes fields we use in this script
type Component = {
  name: string
  status: 'draft' | 'experimental' | 'alpha' | 'beta' | 'stable' | 'deprecated'
  importPath:
    | '@primer/react'
    | '@primer/react/next'
    | '@primer/react/deprecated'
    | '@primer/react/experimental'
    | '@primer/react/drafts'
  stories: Array<{id: string; code?: string}>
  source?: string
}

const ajv = new Ajv()

function formatMDError(lintError: LintError): string {
  let range = ''

  if (lintError.errorRange.length) {
    range = `:${lintError.errorRange[0]}-${lintError.errorRange[0] + lintError.errorRange[1]}`
  }

  const prefix = chalk.gray(`${lintError.lineNumber}${range}`)
  return `${prefix} - ${chalk.yellow(lintError.ruleDescription)}: ${lintError.errorDetail}`
}

ajv.addFormat('markdown', {
  type: 'string',
  validate: (value: string) => {
    const lintResult = mdLint({
      config: {
        'first-line-h1': false,
        'single-trailing-newline': false,
        'line-length': false,
      },
      strings: {
        md: value,
      },
    })

    if (lintResult.md.length > 0) {
      // eslint-disable-next-line no-console
      console.error(`${chalk.red('Markdown linting errors for text: ')}"${value}"\n`)
      for (const error of lintResult.md) {
        // eslint-disable-next-line no-console
        console.error(`  ${formatMDError(error)}\n`)
      }

      return false
    }

    return true
  },
})

// Get all JSON files matching `src/**/*.docs.json`
const docsFiles = glob.sync('src/**/*.docs.json')

// Get the story name prefix for the default story id
const storyPrefix = {
  draft: 'experimental-',
  experimental: 'experimental-',
  deprecated: 'deprecated-',
  alpha: '',
  beta: '',
  stable: '',
}

let _storybookData: StorybookData | null = null

function getStorybookData(): StorybookData {
  const input = args.values['storybook-data']
  if (!input) {
    throw new Error('Unable to get value for --storybook-data')
  }

  if (_storybookData === null) {
    const filepath = path.resolve(process.cwd(), args.values['storybook-data']!)
    const contents = fs.readFileSync(filepath, 'utf-8')
    _storybookData = JSON.parse(contents)
  }

  return _storybookData as StorybookData
}

const components = docsFiles.map(docsFilepath => {
  const docs = JSON.parse(fs.readFileSync(docsFilepath, 'utf-8'))

  // Create a validator for the component schema
  const validate = ajv.compile<Component>(componentSchema)

  // Validate the component schema
  if (!validate(docs)) {
    throw new Error(`Invalid docs file ${docsFilepath}: ${JSON.stringify(validate.errors, null, 2)}}`)
  }

  // Get path to default story file
  // Example: src/components/Box/Box.docs.json -> src/components/Box/Box.stories.tsx
  const defaultStoryFilepath = docsFilepath.replace(/\.docs\.json$/, '.stories.tsx')

  const isComponentV2 = docs.importPath === '@primer/react/next'
  const docsName = String(docs.name).toLowerCase()
  const componentName = isComponentV2 ? `${docsName}v2` : docsName

  // Get the default story id
  const defaultStoryId = `${storyPrefix[docs.status]}components-${componentName}--default`

  // Get source code for default story
  const {Default: defaultStoryCode} = getStorySourceCode(defaultStoryFilepath)

  // Get path to feature story file
  // Example: src/components/Box/Box.docs.json -> src/components/Box/Box.features.stories.tsx
  const featureStoryFilepath = docsFilepath.replace(/\.docs\.json$/, '.features.stories.tsx')
  const exampleStoryFilepath = docsFilepath.replace(/\.docs\.json$/, '.examples.stories.tsx')

  // Get source code for each feature story
  const featureStorySourceCode = getStorySourceCode(featureStoryFilepath)
  const exampleStorySourceCode = getStorySourceCode(exampleStoryFilepath)

  // Populate source code for each feature story
  // if stories are not defined in *.docs.json, fill feature stories as default
  const stories = (docs.stories.length > 0 ? docs.stories : getStoryIds(docs, Object.keys(featureStorySourceCode)))
    // Filter out the default story
    .filter(({id}) => {
      return id !== defaultStoryId
    })
    .map(({id}) => {
      if (id.endsWith('--default')) {
        return {
          id,
          code: defaultStoryCode,
        }
      }
      const storyName = getStoryName(id)
      const code = id.includes('-features--') ? featureStorySourceCode[storyName] : exampleStorySourceCode[storyName]

      if (!code) {
        throw new Error(
          `Invalid story id "${id}" in ${docsFilepath}. No story named "${storyName}" found in ${featureStoryFilepath}`,
        )
      }

      return {id, code}
    })

  // Replace the stories array with the new array that includes source code
  docs.stories = stories

  // Add default story to the beginning of the array
  if (defaultStoryCode) {
    const hasDefaultStory = docs.stories.find(story => story.code === defaultStoryCode)
    if (!hasDefaultStory) {
      docs.stories.unshift({
        id: defaultStoryId,
        code: defaultStoryCode,
      })
    }
  }

  if (args.values['storybook-data']) {
    const storybookData = getStorybookData()
    for (const story of docs.stories) {
      const match = Object.values(storybookData.entries).find(entry => {
        return entry.id === story.id
      })
      if (!match) {
        throw new Error(`Story "${story.id}" not found in storybook-data`)
      }
    }
  }

  // TODO: Provide default type and description for sx and ref props
  return {
    source: `https://github.com/primer/react/tree/main/packages/react/${docsFilepath.substring(0, docsFilepath.lastIndexOf('/'))}`,
    ...docs,
  }
})

const data = {schemaVersion: 2, components: keyBy(components, 'id')}

// Validate output
const validate = ajv.compile(outputSchema)

if (!validate(data)) {
  throw new Error(`Invalid output: ${JSON.stringify(validate.errors, null, 2)}}`)
}

// Create `generated` directory if it doesn't exist
if (!fs.existsSync('generated')) {
  fs.mkdirSync('generated')
}

// Write components.json file
fs.writeFileSync('generated/components.json', JSON.stringify(data, null, 2))

// Print success message
// eslint-disable-next-line no-console
console.log(
  `Successfully built "generated/components.json" from ${docsFiles.length} files matching "src/**/*.docs.json"`,
)

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
function getStorySourceCode(filepath: string) {
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

      let id: Identifier | null = null
      let func: ArrowFunctionExpression | FunctionDeclaration | null = null

      if (varDeclaration?.type === 'VariableDeclaration') {
        id = varDeclaration.declarations[0].id as Identifier
        const init = varDeclaration.declarations[0].init
        if (init?.type === 'ArrowFunctionExpression') {
          func = init
        } else if (init?.type === 'ObjectExpression') {
          const renderProperty = init.properties.find(property => {
            if (property.type === 'ObjectProperty') {
              if (property.key.type === 'Identifier') {
                return property.key.name === 'render'
              }
            }
            return false
          })

          if (renderProperty?.type === 'ObjectProperty' && renderProperty.value.type === 'ArrowFunctionExpression') {
            func = renderProperty.value
          }
        }
      } else if (varDeclaration?.type === 'FunctionDeclaration') {
        id = varDeclaration.id as Identifier
        func = varDeclaration
      }

      if (!id || !func) {
        return
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

function getStoryName(id: string) {
  const parts = id.split('--')
  return pascalCase(parts[parts.length - 1])
}

function getStoryIds(docs: Component, storyNames: string[]) {
  const ids = storyNames.map(
    storyName =>
      `${storyPrefix[docs.status]}components-${String(docs.name).toLowerCase()}-features--${kebabCase(storyName)}`,
  )

  return ids.map(id => ({id}))
}

interface StorybookData {
  v: number
  entries: {
    [key: string]: {
      id: string
    }
  }
}
