const githubMarkdownOpinions = require('@github/markdownlint-github')

// Rules we want to enforce
const rulesToEnforce = {
  'fenced-code-language': false,
  'no-duplicate-header': false, // Fix https://github.com/primer/doctocat/issues/527, then set this rule to `siblings_only: true`
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
  'no-space-in-emphasis': false,
}
const options = githubMarkdownOpinions.init({...rulesToNotEnforce, ...rulesToEnforce})
module.exports = {
  config: options,
  customRules: ['@github/markdownlint-github'],
  outputFormatters: [
    ['markdownlint-cli2-formatter-pretty', {appendLink: true}], // ensures the error message includes a link to the rule documentation
  ],
}
