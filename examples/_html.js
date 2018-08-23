module.exports = ({html = '', scripts, title = 'primer-react', basename, static: staticBuild}) =>
  `<!DOCTYPE html>
  <html>
  <head>
    <title>${title}</title>
    <meta name='viewport' content='width=device-width,initial-scale=1'>
    <meta name='generator' content='Compositor X0'>
    <meta name='og:title' content='Primer React'>
    <meta name='description' content='Primer components built with React.js.'>
    <link rel='icon' href='https://primer.github.io/favicon.png'>
    <link rel='stylesheet' href='${basename}/dist/css/build.css'>
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
