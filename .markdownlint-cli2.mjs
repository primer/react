import githubMarkdownOpinions, {init} from '@github/markdownlint-github'

// Rules we want to turn on but currently have too many violations
const rulesToEnforce = {
  'fenced-code-language': false,
  // Fix https://github.com/primer/doctocat/issues/527, then set this rule to `siblings_only: true`
  'no-duplicate-header': false,
  // This currently conflicts with how prettier autoformats
  'ul-style': false,
}
// Rules we don't care to enforce (usually stylistic)
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
  'blanks-around-fences': false,
  'descriptive-link-text': false,
  'table-column-style': false,
}

const defaultOverrides = {
  'no-generic-link-text': {exceptions: ['link']}, // We don't want it to flag links that link to `Link` component.
}

const options = {
  config: init({
    ...rulesToNotEnforce,
    ...rulesToEnforce,
    ...defaultOverrides,
  }),
  customRules: ['@github/markdownlint-github'],
  outputFormatters: [
    ['markdownlint-cli2-formatter-pretty', {appendLink: true}], // ensures the error message includes a link to the rule documentation
  ],
}

export default options
