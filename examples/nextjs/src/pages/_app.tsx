import Script from 'next/script'
import {ThemeProvider, ThemeScriptProps} from '@primer/react/ThemeProvider'

function ThemeScript(props: ThemeScriptProps) {
  return <Script {...props} strategy="beforeInteractive" />
}

export default function App({Component, pageProps}) {
  return (
    <ThemeProvider preventSSRMismatch script={ThemeScript}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
