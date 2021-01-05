import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {MenuContext} from './SelectMenuContext'
import SelectMenuList from './SelectMenuList'
import theme from '../theme'
import {COMMON, get} from '../constants'
import sx from '../sx'

const TabPanelBase = ({tabName, className, children, ...rest}) => {
  const menuContext = useContext(MenuContext)
  return (
    <div role="tabpanel" className={className} hidden={menuContext.selectedTab !== tabName} {...rest}>
      <SelectMenuList>{children}</SelectMenuList>
    </div>
  )
}

const TabPanel = styled(TabPanelBase)`
  border-top: ${get('borderWidths.1')} solid ${get('colors.border.gray')};
  ${COMMON}
  ${sx};
`

TabPanel.defaultProps = {
  theme,
}

TabPanel.propTypes = {
  tabName: PropTypes.string,
  ...COMMON.propTypes,
  ...sx.propTypes,
}

TabPanel.displayName = 'SelectMenu.TabPanel'

export default TabPanel
