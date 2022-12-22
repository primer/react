import fs from 'fs'
import glob from 'fast-glob'
import keyBy from 'lodash.keyby'
import Ajv from 'ajv'
import componentSchema from './component.schema.json'
import outputSchema from './output.schema.json'

const ajv = new Ajv()

const jsonFiles = glob.sync('src/**/*.docs.json')

const components = jsonFiles.map(file => {
  const json = JSON.parse(fs.readFileSync(file, 'utf-8'))

  // Validate component json
  const validate = ajv.compile(componentSchema)

  if (!validate(json)) {
    throw new Error(`Invalid file ${file}: ${JSON.stringify(validate.errors, null, 2)}}`)
  }

  // TODO: Assert that component ids use kebab-case
  // TODO: Provide default type and description for sx and ref props
  // TODO: Sort component props
  return json
})

const data = {schemaVersion: 1, components: keyBy(components, 'id')}

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
  `Successfully built "generated/components.json" from ${jsonFiles.length} files matching "src/**/*.docs.json"`,
)
