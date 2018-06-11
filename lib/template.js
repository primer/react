const theme = require('../src/theme')

const fonts = theme.fonts
  .map(font => font.match(/ /) ? `"${font}"` : font)
  .join(', ')

// TODO: load these on a per-example basis?
const primerPackages = [
  'primer-buttons',
  'primer-forms',
  'primer-layout',
  'primer-product',
  'primer-tooltips',
  'primer-utilities',
]

module.exports = ({
  html,
  css,
  scripts,
  title,
  static: isStatic
}) => `<!DOCTYPE html>
<head>
  <title>${title}</title>
  <meta name="og:title" content="Primer React">
  <meta name="description" content="Primer components built with React.js.">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  ${css || ''}
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: ${fonts};
      line-height: ${theme.lineHeight};
    }
  </style>
  ${primerPackages.map(pkg => (
    `<link rel="stylesheet" href="https://unpkg.com/${pkg}/build/build.css">`
  )).join('\n')}
</head>
<body>
  <div id="root">${html || ''}</div>
  ${scripts || ''}
</body>
`
