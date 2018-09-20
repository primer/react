import React from 'react'
import Document, {Head, Main, NextScript} from 'next/document'
// this relies on the raw-loader rule in next.config.js's webpack()
import baseCSS from '../dist/primer-components.css'
import {ServerStyleSheet} from 'styled-components'
import {extractCritical} from 'emotion-server'

export default class MyDocument extends Document {
  static getInitialProps({renderPage}) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))
    const styles = sheet.getStyleElement()
    const {css} = extractCritical(page.html)
    return {...page, styles, css}
  }

  render() {
    const {
      css,
      styles,
      // the assetPrefix is set in next.config.js
      __NEXT_DATA__: {assetPrefix = ''}
    } = this.props

    const asset = path => assetPrefix + path

    return (
      <html lang="en">
        <Head>
          <title>Primer Components</title>
          <meta charSet="utf8" />
          <link rel="icon" href={asset('/static/assets/favicon.png')} />
          <link rel="apple-touch-icon" href={asset('/static/assets/apple-touch-icon.png')} />
          <style id="primer-components">{baseCSS}</style>
          <style id="emotion-static">{css}</style>
          {styles}
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="og:title" content="Primer React" />
          <meta name="description" content="Primer components built with React.js." />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
