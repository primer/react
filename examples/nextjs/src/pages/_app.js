import {ThemeProvider, BaseStyles} from '@primer/react'
import React from 'react'

export default function App({Component, pageProps}) {
  return (
    <ThemeProvider>
      <BaseStyles>
        <Component {...pageProps} />
      </BaseStyles>
    </ThemeProvider>
  )
}
