import React, {useContext} from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {MenuContext} from './SelectMenuContext'
import theme from './theme'
import {get} from './constants'

const TabPanel = ({tabName, className, children}) => {
  const menuContext = useContext(MenuContext)
  return (
    <div
      role="tabpanel"
      className={className}
      hidden={menuContext.selectedTab !== tabName || menuContext.initialTab !== tabName}
    >
      {children}
    </div>
  )
}

const SelectMenuTabPanel = styled(TabPanel)`
  border-top: 1px ${get('colors.gray.2')} solid;
`

SelectMenuTabPanel.defaultProps = {
  theme
}

SelectMenuTabPanel.propTypes = {
  tabName: PropTypes.string
}

export default SelectMenuTabPanel
