// @preval
const {join} = require('path')
const {readFileSync} = require('fs')

module.exports = readFileSync(join(__dirname, '../theme.css'), 'utf8')
