module.exports = ({html = '', scripts, title = 'primer-react', static: staticBuild}) =>
  `<!DOCTYPE html>
  <html>
  <head>
    <title>${title}</title>
    <meta name='viewport' content='width=device-width,initial-scale=1' />
    <meta name='generator' content='Compositor X0' />
    <link rel='stylesheet' href='https://unpkg.com/primer-buttons/build/build.css' />
    <link rel='stylesheet' href='https://unpkg.com/primer-forms/build/build.css' />
    <link rel='stylesheet' href='https://unpkg.com/primer-layout/build/build.css' />
    <link rel='stylesheet' href='https://unpkg.com/primer-navigation/build/build.css' />
    <link rel='stylesheet' href='https://unpkg.com/primer-product/build/build.css'/>
    <link rel='stylesheet' href='https://unpkg.com/primer-tooltips/build/build.css'/>
    <link rel='stylesheet' href='https://unpkg.com/primer-utilities/build/build.css'/>
    <link rel='icon' href='https://primer.github.io/favicon.png' />
    <link rel='apple-touch-icon' href='assets/apple-touch-icon.png' />
    <meta name='og:title' content='Primer React' />
    <meta name='description' content='Primer components built with React.js.' />
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
  <div id=root>${html}</div>
  </body>
  </html>
  ${staticBuild ? '' : scripts}
  `
