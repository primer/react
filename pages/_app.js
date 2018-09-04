import React from 'react'
import App, {Container} from 'next/app'
import {Layout} from 'mdx-docs'
import Octicon, {iconsByName} from '@githubprimer/octicons-react'
import * as primerComponents from '../src'
import * as docComponents from './doc-components'
import SideNav from './doc-components/SideNav'
import Header from './doc-components/Header'
import customTheme from './doc-components/theme'

const iconsObject = Object.keys(iconsByName).reduce((map, key) => {
  map[iconsByName[key].name] = iconsByName[key]
  return map
}, {})

const components = {...primerComponents, ...docComponents, Octicon, ...iconsObject}

const routes = [
  {name: 'Home', path: '/'},
  {name: 'Components', path: '/components/'},
  {name: 'Demos', path: '/demos'},
  {name: 'Avatar', path: '/components/avatar'}
]

export default class MyApp extends App {
  static async getInitialProps({Component, ctx}) {
    let page = {}

    if (Component.getInitialProps) {
      page = await Component.getInitialProps(ctx)
    }

    return {page}
  }

  render() {
    const {Component, page} = this.props
    return (
      <Container>
        <Layout
          components={components}
          {...this.props}
          routes={routes}
          theme={customTheme}
          header={<Header />}
          sidebar={<SideNav />}
          layoutMain
        >
          <Component {...page} />
        </Layout>
      </Container>
    )
  }
}
