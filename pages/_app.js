import React from 'react'
import App, {Container} from 'next/app'
import {Layout} from 'mdx-docs'
import Octicon, {iconsByName} from '@githubprimer/octicons-react'
import * as primerComponents from '..'
import * as docComponents from './doc-components'

const {BaseStyles, Box, FlexContainer, Link} = primerComponents
const {SideNav, Header, IndexHero, customTheme} = docComponents

const iconComponents = Object.keys(iconsByName).reduce((map, key) => {
  map[iconsByName[key].name] = iconsByName[key]
  return map
}, {})

const DocLink = props => <Link nounderline {...props} />

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
    const {Component, page} = this.props
    const isIndex = pathname === '/' || pathname === '/components'

    return (
      <BaseStyles>
        <Container>
          <Layout components={components} routes={[]} theme={customTheme}>
            <Header />
            <FlexContainer>
              <SideNav />
              <Box width="100%">
                {isIndex && <IndexHero />}
                <Box color="gray.9" maxWidth={1012} width={'100%'} my={6} mx={'auto'} px={6} className="markdown-body">
                  <Component {...page} />
                </Box>
              </Box>
            </FlexContainer>
          </Layout>
        </Container>
      </BaseStyles>
    )
  }
}
