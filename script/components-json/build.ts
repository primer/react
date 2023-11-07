import generate from '@babel/generator'
import {parse} from '@babel/parser'
import traverse from '@babel/traverse'
import {ArrowFunctionExpression, Identifier, VariableDeclaration} from '@babel/types'
import Ajv from 'ajv'
import {pascalCase} from 'change-case'
import glob from 'fast-glob'
import fs from 'fs'
import keyBy from 'lodash.keyby'
import prettier from '@prettier/sync'
import componentSchema from './component.schema.json'
import outputSchema from './output.schema.json'

// Only includes fields we use in this script
type Component = {
  name: string
  status: 'draft' | 'experimental' | 'alpha' | 'beta' | 'stable' | 'deprecated'
  stories: Array<{id: string; code?: string}>
}

const ajv = new Ajv()

// Get all JSON files matching `src/**/*.docs.json`
const docsFiles = glob.sync('src/**/*.docs.json')

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

  // Get the story name prefix for the default story id
  const storyPrefix = {
    draft: 'drafts-',
    experimental: 'experimental-',
    deprecated: 'deprecated-',
    alpha: '',
    beta: '',
    stable: '',
  }
  // Get the default story id
  const defaultStoryId = `${storyPrefix[docs.status]}components-${String(docs.name).toLowerCase()}--default`

  // Get source code for default story
  const {Default: defaultStoryCode} = getStorySourceCode(defaultStoryFilepath)

  // Get path to feature story file
  // Example: src/components/Box/Box.docs.json -> src/components/Box/Box.features.stories.tsx
  const featureStoryFilepath = docsFilepath.replace(/\.docs\.json$/, '.features.stories.tsx')

  // Get source code for each feature story
  const featureStorySourceCode = getStorySourceCode(featureStoryFilepath)

  // Populate source code for each feature story
  const featureStories = docs.stories
    // Filter out the default story
    .filter(({id}) => id !== defaultStoryId)
    .map(({id}) => {
      const storyName = getStoryName(id)
      const code = featureStorySourceCode[storyName]

      if (!code) {
        throw new Error(
          `Invalid story id "${id}" in ${docsFilepath}. No story named "${storyName}" found in ${featureStoryFilepath}`,
        )
      }

      return {id, code}
    })

  // Replace the stories array with the new array that includes source code
  docs.stories = featureStories

  // Add default story to the beginning of the array
  if (defaultStoryCode) {
    docs.stories.unshift({
      id: defaultStoryId,
      code: defaultStoryCode,
    })
  }

  // TODO: Provide default type and description for sx and ref props
  return docs
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
      const varDecloration = path.node.declaration as VariableDeclaration
      const id = varDecloration.declarations[0].id as Identifier
      const name = id.name
      const func = varDecloration.declarations[0].init as ArrowFunctionExpression

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

      stories[name] = code
    },
  })

  return stories
}

function getStoryName(id: string) {
  const parts = id.split('--')
  return pascalCase(parts[parts.length - 1])
}
