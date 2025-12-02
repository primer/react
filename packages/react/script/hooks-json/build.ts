import glob from 'fast-glob'
import fs from 'fs'
import keyBy from 'lodash.keyby'
import hookSchema from '../hooks-json/hook.schema.json'
import outputSchema from './output.schema.json'
import Ajv from 'ajv'

// Only includes fields we use in this script
type Hook = {
  name: string
  importPath: '@primer/react' | '@primer/react/experimental'
  stories: Array<{id: string}>
}

const ajv = new Ajv()

const hookDocsFiles = glob.sync('src/**/*.hookDocs.json')

const hooks = hookDocsFiles.map(docsFilepath => {
  const docs = JSON.parse(fs.readFileSync(docsFilepath, 'utf-8'))

  // Create a validator for the hook schema
  const validate = ajv.compile<Hook>(hookSchema)

  // Validate the hook schema
  if (!validate(docs)) {
    throw new Error(`Invalid docs file ${docsFilepath}: ${JSON.stringify(validate.errors, null, 2)}}`)
  }

  return docs
})

const data = {schemaVersion: 2, hooks: keyBy(hooks, 'name')}

// Validate output
const validate = ajv.compile(outputSchema)

if (!validate(data)) {
  throw new Error(`Invalid output: ${JSON.stringify(validate.errors, null, 2)}}`)
}

// Create `generated` directory if it doesn't exist
if (!fs.existsSync('generated')) {
  fs.mkdirSync('generated')
}

// Write hooks.json file
fs.writeFileSync('generated/hooks.json', JSON.stringify(data, null, 2))
