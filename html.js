module.exports = ({
  html = '',
  css = '',
  scripts,
  js,
  publicPath,
  title = 'x0',
  meta = [],
  links = [],
  static: staticBuild
}) =>
`<!DOCTYPE html>
  <head>
    <title>primer-react</title>
    <meta name='viewport' content='width=device-width,initial-scale=1' />
    <meta name='generator' content='Compositor X0' />
    <link rel='stylesheet' href='https://unpkg.com/primer-buttons/build/build.css' />
    <link rel='stylesheet' href='https://unpkg.com/primer-forms/build/build.css' />
    <link rel='stylesheet' href='https://unpkg.com/primer-layout/build/build.css' />
    <link rel='stylesheet' href='https://unpkg.com/primer-navigation/build/build.css' />
    <link rel='stylesheet' href='https://unpkg.com/primer-product/build/build.css'/>
    <link rel='stylesheet' href='https://unpkg.com/primer-tooltips/build/build.css'/>
    <link rel='stylesheet' href='https://unpkg.com/primer-utilities/build/build.css'/>
    <link rel='icon' href='assets/favicon.png' />
    <link rel='apple-touch-icon' href='assets/apple-touch-icon.png' />
    <meta name='og:title' content='Primer React' />
    <meta name='description' content='Primer components built with React.js.' />
  </head>
  <div id=root>${html}</div>
  ${staticBuild ? '' : scripts}
  `
