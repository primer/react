import React from 'react'
import {ThemeProvider} from 'emotion-theming'
import PropTypes from 'prop-types'
import {NavLink} from 'react-router-dom'
import Styles from './doc-components/Styles'
import Octicon, {Package} from '@githubprimer/octicons-react'
import {Block, Link, Text, UnderlineNav, UnderlineNavLink, theme} from '../src'
import {name, repository, version} from '../package.json'

const pkg = `${name}@${version}`
const releaseURL = `https://github.com/${repository}/releases/v${version}`

export default function Page({render}) {
  return (
    <React.Fragment>
      <Styles />
      <ThemeProvider theme={theme}>
        <Block color="bodytext">
          <UnderlineNav
            actions={
              <Text color="gray.5" fontFamily="mono" px={4}>
                <Octicon icon={Package} className="mr-2" />
                <Link href={releaseURL}>{pkg}</Link>
              </Text>
            }
          >
            <UnderlineNavLink tag={NavLink} to="/components" px={3}>
              Components
            </UnderlineNavLink>
            <UnderlineNavLink tag={NavLink} to="/demos" px={3}>
              Demos
            </UnderlineNavLink>
            <UnderlineNavLink tag={NavLink} to="/sandbox" px={3}>
              Sandbox
            </UnderlineNavLink>
          </UnderlineNav>
          <Block p={3}>{render()}</Block>
        </Block>
      </ThemeProvider>
    </React.Fragment>
  )
}

Page.propTypes = {
  render: PropTypes.func
}
