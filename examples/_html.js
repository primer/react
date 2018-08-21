const React = require('react')
const ReactDOM = require('react-dom')
const css = require('../src/css')

module.exports = ({html = '', scripts, title = 'primer-react', static: staticBuild}) =>
  `<!DOCTYPE html>
  <html>
  <head>
    <title>${title}</title>
    <meta name='viewport' content='width=device-width,initial-scale=1' />
    <meta name='generator' content='Compositor X0' />
    <meta name='og:title' content='Primer React' />
    <meta name='description' content='Primer components built with React.js.' />
    <link rel='icon' href='/assets/favicon.png' />
    <style id="primer-css">${css}</style>
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
  `
