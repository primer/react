import React from 'react'
import App, {Container} from 'next/app'
import getConfig from 'next/config'
import {Layout} from 'mdx-docs'
import Octicon, {iconsByName, Pencil} from '@githubprimer/octicons-react'
import * as primerComponents from '../src'
import * as docComponents from './doc-components'

const {publicRuntimeConfig: {pageMap}} = getConfig()
const {SideNav, Header, customTheme} = docComponents
const {Box, FlexContainer, Link, Text} = primerComponents

const iconComponents = Object.keys(iconsByName).reduce((map, key) => {
  map[iconsByName[key].name] = iconsByName[key]
  return map
}, {})

const DocLink = props => <Link nounderline {...props} />
const editLinkBase = 'https://github.com/primer/components/edit/master/pages'

const components = {
  ...iconComponents,
  ...docComponents,
  ...primerComponents,
  Octicon,
  // render links with our component
  a: DocLink
}

export default class MyApp extends App {
  static async getInitialProps({Component, ctx}) {
    let page = {}

    if (Component.getInitialProps) {
      page = await Component.getInitialProps(ctx)
    }

    return {page}
  }

  render() {
    const {pathname} = this.props.router
    const filename = pageMap[pathname]
    if (!filename) {
      console.warn(`pathname "${pathname}" doesn't exist in pageMap:`, pageMap)
    }
    const {Component, page} = this.props
    return (
      <Container>
        <Layout components={components} routes={[]} theme={customTheme}>
          <Header />
          <FlexContainer>
            <SideNav />
            <Box maxWidth={1012} width={'100%'} my={6} mx={'auto'} px={6} className="markdown-body">
              <Component {...page} />
              {filename && (
                <Box color="gray.5" borderColor="gray.2" borderTop={1} my={6} pt={2}>
                  <Text mr={2}>
                    <Octicon icon={Pencil} />
                  </Text>
                  <DocLink muted href={`${editLinkBase}${filename}`}>Edit this page</DocLink> on GitHub
                </Box>
              )}
            </Box>
          </FlexContainer>
        </Layout>
      </Container>
    )
  }
}
