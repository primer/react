import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

const BaseCSS = ({ css }) =>
  <style
    dangerouslySetInnerHTML={{
      __html: css
    }}
  />

BaseCSS.defaultProps = {
  css: '*{box-sizing:border-box}body{margin:0}'
}

export default class MyDocument extends Document {
  static getInitialProps ({ renderPage }) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props => (
      sheet.collectStyles(<App {...props} />)
    ))
    const styles = sheet.getStyleElement()
    return { ...page, styles }
  }

  render () {
    const { styles } = this.props

    return (
      <html>
        <Head>
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
          <BaseCSS />
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
