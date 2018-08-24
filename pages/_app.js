import React from 'react'
import App, { Container } from 'next/app'
import {ThemeProvider} from 'emotion-theming'
import {
  Layout,
  Pagination
} from 'mdx-docs'
import * as components from '../src'
import {theme} from '../src'
import * as docComponents from  './doc-components'
import SideNav from './doc-components/SideNav'
import Header from './doc-components/Header'

const routes = [
  { name: 'Home', path: '/' },
  { name: 'Components', path: '/components/' },
  { name: 'Demos', path: '/demos'},
  { name: 'Avatar', path: '/components/avatar'}
]

export default class MyApp extends App {
  static async getInitialProps ({ Component, router, ctx }) {
    let page = {}

    if (Component.getInitialProps) {
      page = await Component.getInitialProps(ctx)
    }

    return { page }
  }

  render () {
    const { Component, page } = this.props

    return (
      <ThemeProvider theme={theme}>
        <Container>
          <Layout
            components={Object.assign(components, docComponents)}
            {...this.props}
            routes={routes}
            header={(<Header />)}
            sidebar={(
              <SideNav />
            )}
            >
            <Component {...page} />
          </Layout>
        </Container>
      </ThemeProvider>
    )
  }
}
