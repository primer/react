import classnames from 'classnames'
import {To} from 'history'
import React from 'react'
import styled from 'styled-components'
import {get} from './constants'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'
import getGlobalFocusStyles from './_getGlobalFocusStyles'

const ITEM_CLASS = 'TabNav-item'
const SELECTED_CLASS = 'selected'

const TabNavTabList = styled.div<SxProp>`
  display: flex;
  margin-bottom: -1px;
  overflow: auto;
`

const TabNavBody = styled.nav`
  margin-top: 0;
  border-bottom: 1px solid ${get('colors.border.default')};
  ${sx}
`

export type TabNavProps = ComponentProps<typeof TabNavTabList>

function TabNav({children, 'aria-label': ariaLabel, ...rest}: TabNavProps) {
  return (
    <TabNavBody aria-label={ariaLabel}>
      <TabNavTabList role="tablist" {...rest}>
        {children}
      </TabNavTabList>
    </TabNavBody>
  )
}

type StyledTabNavLinkProps = {
  to?: To
  selected?: boolean
} & SxProp

const TabNavLink = styled.a.attrs<StyledTabNavLinkProps>(props => ({
  activeClassName: typeof props.to === 'string' ? 'selected' : '',
  className: classnames(ITEM_CLASS, props.selected && SELECTED_CLASS, props.className),
  role: 'tab'
}))<StyledTabNavLinkProps>`
  padding: 8px 12px;
  font-size: ${get('fontSizes.1')};
  line-height: 20px;
  color: ${get('colors.fg.default')};
  text-decoration: none;
  background-color: transparent;
  border: 1px solid transparent;
  border-bottom: 0;

  ${getGlobalFocusStyles('-6px')};

  &:hover,
  &:focus {
    color: ${get('colors.fg.default')};
    text-decoration: none;
  }

  &.selected {
    color: ${get('colors.fg.default')};
    border-color: ${get('colors.border.default')};
    border-top-right-radius: ${get('radii.2')};
    border-top-left-radius: ${get('radii.2')};
    background-color: ${get('colors.canvas.default')};
  }

  ${sx};
`

TabNavLink.displayName = 'TabNav.Link'

export type TabNavLinkProps = ComponentProps<typeof TabNavLink>
export default Object.assign(TabNav, {Link: TabNavLink})
