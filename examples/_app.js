import React from 'react'
import PropTypes from 'prop-types'
import Octicon, {Package} from '@githubprimer/octicons-react'
import {NavLink} from 'react-router-dom'
import {Styles} from './doc-components'
import {Box, Link, Sticky, Text, UnderlineNav, UnderlineNavLink} from '../src'
import {name, repository, version} from '../package.json'

const pkg = `${name}@${version}`
const releaseURL = `https://github.com/${repository}/releases/v${version}`

export default function Page({render}) {
  return (
    <React.Fragment>
      <Sticky bg="white" zIndex={100}>
        <UnderlineNav
          pl={3}
          actions={
            <Text color="gray.5" fontFamily="mono" px={4}>
              <Octicon icon={Package} className="mr-2" />
              <Link href={releaseURL}>{pkg}</Link>
            </Text>
          }
        >
          <UnderlineNavLink is={NavLink} to="/components" px={3}>
            Components
          </UnderlineNavLink>
          <UnderlineNavLink is={NavLink} to="/demos" px={3}>
            Demos
          </UnderlineNavLink>
          <UnderlineNavLink is={NavLink} to="/sandbox" px={3}>
            Sandbox
          </UnderlineNavLink>
        </UnderlineNav>
      </Sticky>
      <Box p={3}>{render()}</Box>
      <Styles />
    </React.Fragment>
  )
}

Page.propTypes = {
  render: PropTypes.func
}
