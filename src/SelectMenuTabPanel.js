import React, {useContext} from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {MenuContext} from './SelectMenuContext'
import SelectMenuList from './SelectMenuList'
import theme from './theme'

const TabPanel = ({tabName, className, children}) => {
  const menuContext = useContext(MenuContext)
  return (
    <div
      role="tabpanel"
      className={className}
      hidden={menuContext.selectedTab !== tabName}
    >
      <SelectMenuList>
        {children}
      </SelectMenuList>
    </div>
  )
}

TabPanel.defaultProps = {
  theme
}

TabPanel.propTypes = {
  tabName: PropTypes.string
}

export default TabPanel
