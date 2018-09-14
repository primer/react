import React from 'react'
import Document, {Head, Main, NextScript} from 'next/document'

export default class MyDocument extends Document {
  render() {
    const {
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
