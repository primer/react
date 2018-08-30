import React from 'react'
import App, { Container } from 'next/app'
import {ThemeProvider} from 'emotion-theming'
import {
  Layout,
  Pagination
} from 'mdx-docs'
import Octicon, {iconsByName} from '@githubprimer/octicons-react'
import * as components from '../src'
import {theme} from '../src'
import * as docComponents from  './doc-components'
import SideNav from './doc-components/SideNav'
import Header from './doc-components/Header'

const iconsObject = () => {
  let obj = {}
  Object.keys(iconsByName).map(key => {
    obj[iconsByName[key].name] = iconsByName[key]
  })
  return obj
}

const customTheme = {
  font: theme.fonts.normal,
  LiveEditor: {
    whiteSpace: 'pre-wrap'
  },
  LayoutSidebar: {
    top: '64px',
    backgroundColor: theme.colors.gray[0]
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
          components={Object.assign({}, components, docComponents, {'Octicon': Octicon}, iconsObject())}
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
