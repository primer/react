// @preval
const {join} = require('path')
const {readFileSync} = require('fs')

module.exports = readFileSync(join(__dirname, '../system.css'), 'utf8')
