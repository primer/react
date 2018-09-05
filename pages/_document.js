import React from 'react'
import Document, {Head, Main, NextScript} from 'next/document'
import {ServerStyleSheet} from 'styled-components'

export default class MyDocument extends Document {
  static getInitialProps({renderPage}) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))
    const styles = sheet.getStyleElement()
    return {
      ...page,
      styles
    }
  }

  render() {
    const {styles} = this.props

    return (
      <html lang="en">
        <Head>
          <title>primer-react</title>
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="generator" content="Compositor X0" />
          <link rel="icon" href="/assets/favicon.png" />
          <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
          <meta name="og:title" content="Primer React" />
          <meta name="description" content="Primer components built with React.js." />
          <link rel="stylesheet" href="/dist/css/build.css" />
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
