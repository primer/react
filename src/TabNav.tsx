import classnames from 'classnames'
import * as History from 'history'
import React from 'react'
import styled from 'styled-components'
import {COMMON, get, SystemCommonProps, SystemTypographyProps} from './constants'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

const ITEM_CLASS = 'TabNav-item'
const SELECTED_CLASS = 'selected'

const TabNavBase = styled.div<SystemCommonProps & SxProp>`
  margin-top: 0;
  border-bottom: 1px solid ${get('colors.border.primary')};
  ${COMMON}
  ${sx}
`

const TabNavBody = styled.nav`
  display: flex;
  margin-bottom: -1px;
  overflow: auto;
`

export type TabNavProps = ComponentProps<typeof TabNavBase>

function TabNav({children, "aria-label": ariaLabel, ...rest}: TabNavProps) {
  return (
    <TabNavBase {...rest}>
      <TabNavBody aria-label={ariaLabel}>{children}</TabNavBody>
    </TabNavBase>
  )
}

type StyledTabNavLinkProps = {
  to?: History.LocationDescriptor
  selected?: boolean
} & SystemCommonProps &
  SxProp &
  SystemTypographyProps

const TabNavLink = styled.a.attrs<StyledTabNavLinkProps>(props => ({
  activeClassName: typeof props.to === 'string' ? 'selected' : '',
  className: classnames(ITEM_CLASS, props.selected && SELECTED_CLASS, props.className)
}))<StyledTabNavLinkProps>`
  padding: 8px 12px;
  font-size: ${get('fontSizes.1')};
  line-height: 20px;
  color: ${get('colors.text.primary')};
  text-decoration: none;
  background-color: transparent;
  border: 1px solid transparent;
  border-bottom: 0;

  &:hover,
  &:focus {
    color: ${get('colors.text.primary')};
    text-decoration: none;
  }

  &.selected {
    color: ${get('colors.text.primary')};
    border-color: ${get('colors.border.primary')};
    border-top-right-radius: ${get('radii.2')};
    border-top-left-radius: ${get('radii.2')};
    background-color: ${get('colors.bg.canvas')};
  }

  ${COMMON};
  ${sx};
`

TabNavLink.displayName = 'TabNav.Link'

export type TabNavLinkProps = ComponentProps<typeof TabNavLink>
export default Object.assign(TabNav, {Link: TabNavLink})
