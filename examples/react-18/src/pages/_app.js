import {ThemeProvider, BaseStyles, SSRProvider} from '@primer/react'
import React from 'react'

export default function App({Component, pageProps}) {
  return (
    <ThemeProvider>
      <BaseStyles>
        <SSRProvider>
          <Component {...pageProps} />
        </SSRProvider>
      </BaseStyles>
    </ThemeProvider>
  )
}
