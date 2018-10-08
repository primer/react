import React from 'react'
import Document, {Head, Main, NextScript} from 'next/document'
import {ServerStyleSheet} from 'styled-components'
import {extractCritical} from 'emotion-server'
import {getAssetPath} from './doc-components'
import {utilities, markdown} from '../css'

export default class MyDocument extends Document {
  static getInitialProps({renderPage}) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))
    return {
      ...page,
      styles: (
        <>
          <style id="primer-css">
            {utilities}
            {markdown}
          </style>
          <style id="emotion-static">{extractCritical(page.html).css}</style>
          {sheet.getStyleElement()}
        </>
      )
    }
  }

  render() {
    const {styles} = this.props

    return (
      <html lang="en">
        <Head>
          <script async src="https://www.googletagmanager.com/gtag/js?id=UA-126681523-1" />
          <script async href={getAssetPath('analytics.js')} />
          <title>Primer Components</title>
          <meta charSet="utf8" />
          <link rel="icon" href={getAssetPath('favicon.png')} />
          <link rel="apple-touch-icon" href={getAssetPath('apple-touch-icon.png')} />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="og:title" content="Primer Components" />
          <meta name="og:url" content="primer.style/components">
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
