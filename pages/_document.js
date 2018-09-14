import React from 'react'
import Document, {Head, Main, NextScript} from 'next/document'
import {extractCritical} from 'emotion-server'

export default class MyDocument extends Document {
  static getInitialProps({renderPage}) {
    const page = renderPage()
    const {css} = extractCritical(page.html)
    return {...page, css}
  }

  render() {
    const {
      css,
      // the assetPrefix is set in next.config.js
      __NEXT_DATA__: {assetPrefix = ''}
    } = this.props

    const asset = path => assetPrefix + path

    return (
      <html lang="en">
        <Head>
          <title>primer-react</title>
          <meta charSet="utf8" />
          <link rel="icon" href={asset('/static/assets/favicon.png')} />
          <link rel="apple-touch-icon" href={asset('/static/assets/apple-touch-icon.png')} />
          {/* See: https://github.com/zeit/next-plugins/tree/master/packages/next-sass#usage */}
          <link rel="stylesheet" href={asset('/_next/static/style.css')} />
          {/* eslint-disable-next-line react/no-danger */}
          <style data-emotion dangerouslySetInnerHTML={{__html: css}} />
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
