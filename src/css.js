// @preval
const {join} = require('path')
const {readFileSync} = require('fs')
module.exports = readFileSync(join(process.cwd(), 'dist/css/build.css'), 'utf8')
