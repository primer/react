import React from 'react'
import Document, {Head, Main, NextScript} from 'next/document'

import {theme} from '../src'

const fonts = theme.fonts
  .map(font => font.match(/ /) ? `"${font}"` : font)
  .join(', ')

// TODO: load these on a per-example basis?
const primerPackages = [
  'primer-buttons',
  'primer-forms',
  'primer-layout',
  'primer-product',
  'primer-tooltips',
  'primer-utilities',
]

export default class extends Document {
  render() {
    return (
      <html lang='en'>
        <Head>
          <meta name='og:title' content='Primer React' />
          <meta name='description' content='Primer components built with React.js.' />
          <meta name='viewport' content='width=device-width,initial-scale=1' />
          {primerPackages.map(pkg => (
            <link rel='stylesheet' href={`https://unpkg.com/${pkg}/build/build.css`} key={pkg} />
          ))}
          <style dangerouslySetInnerHTML={{__html: `
            * { box-sizing: border-box; }
            body {
              font-family: ${fonts};
              line-height: ${theme.lineHeight};
            }
          `}} key='primer-base' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
