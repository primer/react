const {join} = require('path')
const {readFileSync} = require('fs')

function getCSS() {
  return readFileSync(join(__dirname, '../dist/css/build.css'), 'utf8')
}

module.exports = function renderDocument(props) {
  const {html = '', scripts, title = '', basename, static: staticBuild} = props

  const styles =
    process.env.NODE_ENV === 'production'
      ? `<link rel='stylesheet' href='${basename}/dist/css/build.css'>`
      : `<style type='text/css' id='primer-react-css'>${getCSS()}</style>`

  return `
<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <meta name='viewport' content='width=device-width,initial-scale=1'>
    <meta name='generator' content='Compositor X0'>
    <meta name='og:title' content='Primer React'>
    <meta name='description' content='Primer components built with React.js.'>
    <link rel='icon' href='https://primer.github.io/favicon.png'>
    ${styles}
  </head>
  <body>
  <script>
    (function() {
      var redirect = sessionStorage.redirect
      delete sessionStorage.redirect
      if (redirect && redirect !== location.href) {
        history.replaceState(null, null, redirect)
      }
    })()
  </script>
    <div id="root">${html}</div>
  </body>
</html>
${staticBuild ? '' : scripts}
  `.trim()
}
