import React from 'react'
import PropTypes from 'prop-types'
import {NavLink} from 'react-router-dom'
import Styles from './doc-components/Styles'
import Octicon, {Package} from '@github/octicons-react'
import {Link, Text, UnderlineNav} from '../src'
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
          <NavLink to="/components" className="px-3">
            Components
          </NavLink>
          <NavLink to="/demos" className="px-3">
            Demos
          </NavLink>
          <NavLink to="/sandbox" className="px-3">
            Sandbox
          </NavLink>
        </UnderlineNav>
        {render()}
      </div>
    </React.Fragment>
  )
}

Page.propTypes = {
  render: PropTypes.func
}
