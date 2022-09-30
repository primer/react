const fs = require('fs/promises')
const preval = require('./src/theme-preval.js')

fs.writeFile('lib/theme-preval.js', `module.exports = ${JSON.stringify(preval, null, 2)}`, 'utf8')
fs.writeFile('lib-esm/theme-preval.js', `export default ${JSON.stringify(preval, null, 2)}`, 'utf8')
