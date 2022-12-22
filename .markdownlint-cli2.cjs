const githubMarkdownOpinions = require('@github/markdownlint-github')

const options = githubMarkdownOpinions.init({
  // Disable rules we don't currently care to enforce pertaining to stylistic things.
  'line-length': false,
  'blanks-around-headings': false,
  'blanks-around-lists': false,
  'no-trailing-spaces': false,
  'no-multiple-blanks': false,
  'no-trailing-punctuation': false,
  'single-trailing-newline': false,
  'ul-indent': false,
  'no-hard-tabs': false,
  'first-line-heading': false
})

module.exports = {
  config: options,
  customRules: ['@github/markdownlint-github']
}
