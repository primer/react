'use strict'

const githubMarkdownOpinions = require('@github/markdownlint-github')

const options = githubMarkdownOpinions.init({
  // Rules we don't care to enforce (usually stylistic)
  'line-length': false,
  'blanks-around-headings': false,
  'blanks-around-lists': false,
  'no-trailing-spaces': false,
  'no-multiple-blanks': false,
  'no-trailing-punctuation': false,
  'single-trailing-newline': false,
  'ul-indent': false,
  'ul-style': false,
  'no-hard-tabs': false,
  'first-line-heading': false,
  'no-space-in-emphasis': false,
  'blanks-around-fences': false,
})

module.exports = {
  config: options,
  customRules: ['@github/markdownlint-github'],
  outputFormatters: [['markdownlint-cli2-formatter-pretty', {appendLink: true}]],
}
