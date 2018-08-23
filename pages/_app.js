import React from 'react'
import App, { Container } from 'next/app'
import {
  Layout,
  Pagination
} from 'mdx-docs'
import * as components from '../src'
import SideNav from './SideNav'

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
          components={components}
          {...this.props}
          routes={routes}
          sidebar={(
            <SideNav />
          )}
          >
          <Component {...page} />
        </Layout>
      </Container>
    )
  }
}
