import {ThemeProvider, BaseStyles} from '@primer/react'
import React from 'react'
import Layout from '../components/Layout'

export default function App({Component, pageProps}) {
  return (
    <ThemeProvider>
      <BaseStyles>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </BaseStyles>
    </ThemeProvider>
  )
}
