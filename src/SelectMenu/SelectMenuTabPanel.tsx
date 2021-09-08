import React, {useContext} from 'react'
import styled from 'styled-components'
import {COMMON, get, SystemCommonProps} from '../constants'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'
import {MenuContext} from './SelectMenuContext'
import SelectMenuList from './SelectMenuList'

const TabPanelBase = styled.div<SystemCommonProps & SxProp>`
  border-top: ${get('borderWidths.1')} solid ${get('colors.border.muted')};
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

TabPanel.displayName = 'SelectMenu.TabPanel'

export default TabPanel
