import React from 'react'
import PropTypes from 'prop-types'
import {NavLink} from 'react-router-dom'
import Styles from './doc-components/Styles'
import Octicon, {Package} from '@github/octicons-react'
import {Link, Text, UnderlineNav, UnderlineNavLink} from '../src'
import {name, repository, version} from '../package.json'

const pkg = `${name}@${version}`
const releaseURL = `https://github.com/${repository}/releases/v${version}`

export default function Page({render}) {
  return (
    <React.Fragment>
      <Styles />
      <div className="text-dark-gray">
        <UnderlineNav
          actions={
            <Text color="gray-light" mono px={4}>
              <Octicon icon={Package} className="mr-2" />
              <Link href={releaseURL}>{pkg}</Link>
            </Text>
          }
        >
          <UnderlineNavLink tag={NavLink} to="/components">
            Components
          </UnderlineNavLink>
          <UnderlineNavLink tag={NavLink} to="/demos">
            Demos
          </UnderlineNavLink>
          <UnderlineNavLink tag={NavLink} to="/sandbox">
            Sandbox
          </UnderlineNavLink>
        </UnderlineNav>
        {render()}
      </div>
    </React.Fragment>
  )
}

Page.propTypes = {
  render: PropTypes.func
}
