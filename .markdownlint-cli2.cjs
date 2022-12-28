const githubMarkdownOpinions = require('@github/markdownlint-github')

// Rules to enable
const rulesToEnable = {
  'no-duplicate-header': false,
  'ul-style': false,
}
// Rules we don't care to enforce.
const rulesToNotEnforce = {
  'line-length': false,
  'blanks-around-headings': false,
  'blanks-around-lists': false,
  'no-trailing-spaces': false,
  'no-multiple-blanks': false,
  'no-trailing-punctuation': false,
  'single-trailing-newline': false,
  'ul-indent': false,
  'no-hard-tabs': false,
  'first-line-heading': false,
}
const options = githubMarkdownOpinions.init({...rulesToNotEnforce, ...rulesToEnable})
module.exports = {
  config: options,
  customRules: ['@github/markdownlint-github'],
}
