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


const customTheme = {
  font: theme.fonts.normal,
  LiveEditor: {
    whiteSpace: 'pre-wrap'
  },
  LayoutSidebar: {
    top: '55px'
  },
  NavLink: {
    padding: '8px 0px',
    fontSize: '16px'
  }
}
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
      <Container>
        <Layout
          components={Object.assign(components, docComponents)}
          {...this.props}
          routes={routes}
          theme={customTheme}
          header={(<Header />)}
          sidebar={(
            <SideNav />
          )}
          layoutMain
          >
          <Component {...page} />
        </Layout>
      </Container>
    )
  }
}
