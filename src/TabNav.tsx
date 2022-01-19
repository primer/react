import classnames from 'classnames'
import {To} from 'history'
import React from 'react'
import styled from 'styled-components'
import {get} from './constants'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

const ITEM_CLASS = 'TabNav-item'
const SELECTED_CLASS = 'selected'

const TabNavBase = styled.div<SxProp>`
  margin-top: 0;
  border-bottom: 1px solid ${get('colors.border.default')};
  ${sx}
`

const TabNavBody = styled.nav`
  display: flex;
  margin-bottom: -1px;
  overflow: auto;
`

export type TabNavProps = ComponentProps<typeof TabNavBase>

function TabNav({children, 'aria-label': ariaLabel, ...rest}: TabNavProps) {
  return (
    <TabNavBase {...rest}>
      <TabNavBody aria-label={ariaLabel}>{children}</TabNavBody>
    </TabNavBase>
  )
}

type StyledTabNavLinkProps = {
  to?: To
  selected?: boolean
} & SxProp

const TabNavLink = styled.a.attrs<StyledTabNavLinkProps>(props => ({
  activeClassName: typeof props.to === 'string' ? 'selected' : '',
  className: classnames(ITEM_CLASS, props.selected && SELECTED_CLASS, props.className)
}))<StyledTabNavLinkProps>`
  padding: 8px 12px;
  font-size: ${get('fontSizes.1')};
  line-height: 20px;
  color: ${get('colors.fg.default')};
  text-decoration: none;
  background-color: transparent;
  border: 1px solid transparent;
  border-bottom: 0;

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
