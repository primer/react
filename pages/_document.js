import React from 'react'
import Document, {Head, Main, NextScript} from 'next/document'
import {ServerStyleSheet} from 'styled-components'
import {parse} from 'url'
// see: https://github.com/zeit/next-plugins/tree/master/packages/next-sass#usage
import '../src/primer-react.scss'

export default class MyDocument extends Document {
  static getInitialProps({renderPage, req, ...rest}) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))
    const styles = sheet.getStyleElement()
    return {...page, styles}
  }

  render() {
    const {
      styles,
      // this comes from the app.setAssetPrefix() call in server.js
      __NEXT_DATA__: {assetPrefix = ''}
    } = this.props

    return (
      <html lang="en">
        <Head>
          <title>primer-react</title>
          <meta charSet="utf8" />
          <link rel="icon" href={`${assetPrefix}/static/assets/favicon.png`} />
          <link rel="apple-touch-icon" href={`${assetPrefix}/static/assets/apple-touch-icon.png`} />
          <link rel="stylesheet" href={`${assetPrefix}/_next/static/style.css`} />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="generator" content="Compositor X0" />
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
