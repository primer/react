import fs from 'fs'
import glob from 'fast-glob'
import keyBy from 'lodash.keyby'

const jsonFiles = glob.sync('src/**/*.docs.json')

const components = jsonFiles.map(file => {
  const json = JSON.parse(fs.readFileSync(file, 'utf-8'))
  // TODO: Validate json with JSON schema for .docs.json files
  // TODO: Assert that component ids use kebab-case
  // TODO: Provide default type and description for sx and ref props
  return json
})

const data = {v: 1, components: keyBy(components, 'id')}

// TODO: Validate `data` with JSON schema for output components.json file

// Create `generated` directory if it doesn't exist
if (!fs.existsSync('generated')) {
  fs.mkdirSync('generated')
}

// Write components.json file
fs.writeFileSync('generated/components.json', JSON.stringify(data, null, 2))
