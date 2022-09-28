import {ThemeProvider, BaseStyles, ThemeScriptProps} from '@primer/react'
import Script from 'next/script'
import React from 'react'

function ThemeScript(props: ThemeScriptProps) {
  return <Script {...props} strategy="beforeInteractive" />
}

export default function App({Component, pageProps}) {
  return (
    <ThemeProvider preventSSRMismatch script={ThemeScript}>
      <BaseStyles>
        <Component {...pageProps} />
      </BaseStyles>
    </ThemeProvider>
  )
}
