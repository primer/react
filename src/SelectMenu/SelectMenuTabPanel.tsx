import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {MenuContext} from './SelectMenuContext'
import SelectMenuList from './SelectMenuList'
import theme from '../theme'
import {COMMON, get, SystemCommonProps} from '../constants'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'

const TabPanelBase = styled.div<SystemCommonProps & SxProp>`
  border-top: ${get('borderWidths.1')} solid ${get('colors.border.gray')};
  ${COMMON}
  ${sx};
`

export type SelectMenuTabPanelProps = {
  tabName?: string
} & ComponentProps<typeof TabPanelBase>

const TabPanel = ({tabName, className, children, ...rest}: SelectMenuTabPanelProps) => {
  const menuContext = useContext(MenuContext)
  return (
    <TabPanelBase role="tabpanel" className={className} hidden={menuContext.selectedTab !== tabName} {...rest}>
      <SelectMenuList>{children}</SelectMenuList>
    </TabPanelBase>
  )
}

TabPanel.defaultProps = {
  theme
}

TabPanel.propTypes = {
  tabName: PropTypes.string,
  ...COMMON.propTypes,
  ...sx.propTypes
}

TabPanel.displayName = 'SelectMenu.TabPanel'

export default TabPanel
