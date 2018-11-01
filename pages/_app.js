import React from 'react'
import App, {Container} from 'next/app'
import getConfig from 'next/config'
import {Layout} from 'mdx-docs'
import Octicon, {iconsByName, Pencil} from '@githubprimer/octicons-react'
import * as docComponents from './doc-components'
import Index from './index.mdx'
import * as primerComponents from '..'
import {repository} from '../package.json'

const {pageMap} = getConfig().publicRuntimeConfig
const {BaseStyles, Box, Flex, Link} = primerComponents
const {SideNav, Header, IndexHero, customTheme} = docComponents

const iconComponents = Object.keys(iconsByName).reduce((map, key) => {
  map[iconsByName[key].name] = iconsByName[key]
  return map
}, {})

const DocLink = props => <Link nounderline {...props} />
const editLinkBase = `https://github.com/${repository}/edit/master/pages`

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
      // eslint-disable-next-line no-console
      console.warn(`pathname "${pathname}" doesn't exist in pageMap:`, pageMap)
    }
    const {Component, page} = this.props
    const isIndex = pathname === '/' || pathname === '/components' || pathname === '/components/'

    return (
      <BaseStyles>
        <Container>
          <Layout components={components} routes={[]} theme={customTheme}>
            <Header />
            <Flex display={['block', 'block', 'flex', 'flex']} flexDirection="row-reverse">
              <Box width="100%">
                {isIndex && <IndexHero />}
                <Box color="gray.9" maxWidth={1012} width={'100%'} my={6} mx={'auto'} px={6} className="markdown-body">
                  {isIndex ? <Index /> : <Component {...page} />}
                  {filename && (
                    <Box color="gray.5" borderColor="gray.2" borderTop={1} my={6} pt={2}>
                      <Text mr={2}>
                        <Octicon icon={Pencil} />
                      </Text>
                      <DocLink muted href={`${editLinkBase}${filename}`}>
                        Edit this page
                      </DocLink>{' '}
                      on GitHub
                    </Box>
                  )}
                </Box>
              </Box>
              <SideNav />
            </Flex>
          </Layout>
        </Container>
      </BaseStyles>
    )
  }
}
