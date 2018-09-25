/* global preval */
import React from 'react'
import Document, {Head, Main, NextScript} from 'next/document'
import {ServerStyleSheet} from 'styled-components'
import {extractCritical} from 'emotion-server'
import preval from 'preval.macro'

const customCSS = preval`
  const {renderFile} = require('../lib/render-sass')
  const path = require.resolve('./primer-custom.scss')
  module.exports = renderFile(path)
`

export default class MyDocument extends Document {
  static getInitialProps({renderPage}) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))
    return {
      ...page,
      styles: (
        <>
          <style id="primer-custom">{customCSS}</style>
          <style id="emotion-static">{extractCritical(page.html).css}</style>
          {sheet.getStyleElement()}
        </>
      )
    }
  }

  render() {
    const {
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
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="og:title" content="Primer React" />
          <meta name="description" content="Primer components built with React.js." />
          {styles}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
