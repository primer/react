import classnames from 'classnames'
import * as History from 'history'
import React from 'react'
import styled from 'styled-components'
import {COMMON, get, SystemCommonProps, SystemTypographyProps} from './constants'
import sx, {SxProp} from './sx'
import theme from './theme'
import {ComponentProps} from './utils/types'

const ITEM_CLASS = 'TabNav-item'
const SELECTED_CLASS = 'selected'

const TabNavBase = styled.nav<SystemCommonProps & SxProp>`
  display: flex;
  border-bottom: 1px solid ${get('colors.border.gray')};

  .TabNav-body {
    display: flex;
    margin-bottom: -1px;
  }

  ${COMMON}
  ${sx}
`

export type TabNavProps = ComponentProps<typeof TabNavBase>

function TabNav({className, children, ...rest}: TabNavProps) {
  const classes = classnames(className, 'TabNav')
  return (
    <TabNavBase className={classes} {...rest}>
      <div className="TabNav-body">{children}</div>
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
  color: ${get('colors.black')};
  text-decoration: none;
  background-color: transparent;
  border: 1px solid transparent;
  border-bottom: 0;

  &:hover,
  &:focus {
    color: ${get('colors.text.grayDark')};
    text-decoration: none;
  }

  &.selected {
    color: ${get('colors.text.grayDark')};
    border-color: ${get('colors.border.gray')};
    border-top-right-radius: ${get('radii.2')};
    border-top-left-radius: ${get('radii.2')};
    background-color: ${get('colors.white')};
  }

  ${COMMON};
  ${sx};
`

TabNav.defaultProps = {theme}

TabNavLink.defaultProps = {theme}

TabNavLink.displayName = 'TabNav.Link'

export type TabNavLinkProps = ComponentProps<typeof TabNavLink>
export default Object.assign(TabNav, {Link: TabNavLink})
