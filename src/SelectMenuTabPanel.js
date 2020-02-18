import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {MenuContext} from './SelectMenuContext'
import SelectMenuList from './SelectMenuList'
import theme from './theme'
import {COMMON} from './constants'

const TabPanelBase = ({tabName, className, children, ...rest}) => {
  const menuContext = useContext(MenuContext)
  return (
    <div role="tabpanel" className={className} hidden={menuContext.selectedTab !== tabName} {...rest}>
      <SelectMenuList>{children}</SelectMenuList>
    </div>
  )
}

const TabPanel = styled(TabPanelBase)`
  ${COMMON}
`

TabPanel.defaultProps = {
  theme
}

TabPanel.propTypes = {
  tabName: PropTypes.string,
  ...COMMON.propTypes
}

export default TabPanel
