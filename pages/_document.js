import React from 'react'
import Document, {Head, Main, NextScript} from 'next/document'
import {ServerStyleSheet} from 'styled-components'
import {parse} from 'url'

const deployURL = process.env.NOW_URL || ''
const deployHostname = parse(deployURL).hostname

export default class MyDocument extends Document {
  static getInitialProps({renderPage, req}) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))
    const styles = sheet.getStyleElement()
    const {hostname} = req.headers
    const baseURL = deployHostname && hostname !== deployHostname ? deployURL : ''
    return {
      ...page,
      styles,
      baseURL
    }
  }

  render() {
    const {baseURL, styles} = this.props

    return (
      <html lang="en">
        <Head>
          <title>primer-react</title>
          <meta charSet="utf8" />
          <link rel="icon" href={`${baseURL}/assets/favicon.png`} />
          <link rel="apple-touch-icon" href={`${baseURL}/assets/apple-touch-icon.png`} />
          <link rel="stylesheet" href={`${baseURL}/dist/css/build.css`} />
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
