import React from 'react'
import App, {Container} from 'next/app'
import {Layout} from 'mdx-docs'
import Octicon, {iconsByName} from '@githubprimer/octicons-react'
import * as primerComponents from '../src'
import * as docComponents from './doc-components'

/**
 * See: https://github.com/zeit/next-plugins/tree/master/packages/next-sass#usage
 * Apparently this needs to live in _app because _document is rendered server-side,
 * so the code it generates isn't included in the client-side bundle.
 *
 * Unfortunately, the Next app's assetPrefix isn't available in this file
 * (except via window.__NEXT_DATA__), so we can't  generate the correct base
 * URL for it here. So the <link> lives in _document but the import has to live
 * here, because ¯\_(ツ)_/¯
 */
import '../src/primer-react.scss'

const {SideNav, Header, customTheme} = docComponents
const {Box, FlexContainer} = primerComponents

const iconsObject = Object.keys(iconsByName).reduce((map, key) => {
  map[iconsByName[key].name] = iconsByName[key]
  return map
}, {})

const components = {...primerComponents, ...docComponents, Octicon, ...iconsObject}

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
        <Layout components={components} routes={[]} theme={customTheme}>
          <Header />
          <FlexContainer>
            <SideNav />
            <Box maxWidth={1012} my={6} mx={'auto'} px={6} className="markdown-body">
              <Component {...page} />
            </Box>
          </FlexContainer>
        </Layout>
      </Container>
    )
  }
}
