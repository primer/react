/** temporary script to debug types */

const fs = require('fs')
const docgen = require('react-docgen-typescript')
const globby = require('globby')

const files = globby.sync('./*.tsx', {absolute: true})
const data = docgen.parse(files, {
  savePropValueAsString: true,
  propFilter: prop => {
    if (prop.declarations !== undefined && prop.declarations.length > 0) {
      const hasPropAdditionalDescription = prop.declarations.find(declaration => {
        return !declaration.fileName.includes('node_modules')
      })

      return Boolean(hasPropAdditionalDescription)
    }

    return true
  }
})

console.log(data)
fs.writeFileSync('output.json', JSON.stringify(data, null, 2), 'utf8')
console.log('\n > output.json \n')
