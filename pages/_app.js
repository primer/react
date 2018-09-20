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

const {SideNav, Header, IndexImage, customTheme} = docComponents
const {Box, FlexContainer, Heading, Text} = primerComponents

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
    const { pathname } = this.props.router
    const {Component, page} = this.props
    if (pathname === '/' || pathname === '/components') {
      return (
        <Container>
          <Layout routes={[]} theme={customTheme}>
          <Header />
            <FlexContainer>
              <SideNav />
              <Box width={'100%'}>
                <Box bg="black">
                  <Box maxWidth={1012} py={6} mb={4} mx={'auto'} px={6}>
                    <Box mt={4} mb={6}>
                      <Heading color="blue.4" fontSize={7} pb={3}>Primer Components</Heading>
                      <Text color="blue.2" fontSize={2} fontWeight={400} className="text-mono">v2.0.4-beta</Text>
                    </Box>
                    <Box mb={6} mx={-4}>
                      <IndexImage />
                    </Box>
                  </Box>
                </Box>
                <Box maxWidth={1012} width={'100%'} py={6} mx={'auto'} px={6}>
                  <Box className="markdown-body">
                    <h1>Getting Started</h1>
                    <p>Install the Design System in your application</p>
                    <code>npm i @primer/components</code>
                  </Box>
                </Box>
              </Box>
            </FlexContainer>
          </Layout>
        </Container>
      )
    }
    return (
      <Container>
        <Layout components={components} routes={[]} theme={customTheme}>
          <Header />
          <FlexContainer>
            <SideNav />
            <Box maxWidth={1012} width={'100%'} my={6} mx={'auto'} px={6} className="markdown-body">
              <Component {...page} />
            </Box>
          </FlexContainer>
        </Layout>
      </Container>
    )
  }
}
