import classnames from 'classnames'
// eslint-disable-next-line import/no-namespace
import * as History from 'history'
import React from 'react'
import styled from 'styled-components'
import {COMMON, get, SystemCommonProps} from './constants'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

const ITEM_CLASS = 'UnderlineNav-item'
const SELECTED_CLASS = 'selected'

const UnderlineNavBase = styled.nav`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${get('colors.border.secondary')};
  &.UnderlineNav--right {
    justify-content: flex-end;

    .UnderlineNav-item {
      margin-right: 0;
      margin-left: ${get('space.3')};
    }

    .UnderlineNav-actions {
      flex: 1 1 auto;
    }
  }
  &.UnderlineNav--full {
    display: block;
  }

  .UnderlineNav-body {
    display: flex;
    margin-bottom: -1px;
  }

  .UnderlineNav-actions {
    align-self: center;
  }

  ${COMMON};
  ${sx};
`

export type UnderlineNavProps = {
  actions?: React.ReactNode
  align?: 'right'
  full?: boolean
  label?: string
} & ComponentProps<typeof UnderlineNavBase>

function UnderlineNav({actions, className, align, children, full, label, theme, ...rest}: UnderlineNavProps) {
  const classes = classnames(className, 'UnderlineNav', align && `UnderlineNav--${align}`, full && 'UnderlineNav--full')
  return (
    <UnderlineNavBase className={classes} aria-label={label} theme={theme} {...rest}>
      <div className="UnderlineNav-body">{children}</div>
      {actions && <div className="UnderlineNav-actions">{actions}</div>}
    </UnderlineNavBase>
  )
}

type StyledUnderlineNavLinkProps = {
  to?: History.LocationDescriptor
  selected?: boolean
} & SystemCommonProps &
  SxProp

const UnderlineNavLink = styled.a.attrs<StyledUnderlineNavLinkProps>(props => ({
  activeClassName: typeof props.to === 'string' ? 'selected' : '',
  className: classnames(ITEM_CLASS, props.selected && SELECTED_CLASS, props.className)
}))<StyledUnderlineNavLinkProps>`
  padding: ${get('space.3')} ${get('space.2')};
  margin-right: ${get('space.3')};
  font-size: ${get('fontSizes.1')};
  line-height: ${get('lineHeights.default')};
  color: ${get('colors.underlinenav.text')};
  text-align: center;
  border-bottom: 2px solid transparent;
  text-decoration: none;

  &:hover,
  &:focus {
    color: ${get('colors.underlinenav.textHover')};
    text-decoration: none;
    border-bottom-color: ${get('colors.border.tertiary')};
    transition: 0.2s ease;

    .UnderlineNav-octicon {
      color: ${get('colors.text.tertiary')};
    }
  }

  &.selected {
    color: ${get('colors.underlinenav.textActive')};
    border-bottom-color: ${get('colors.underlinenav.borderActive')};

    .UnderlineNav-octicon {
      color: ${get('colors.underlinenav.iconActive')};
    }
  }

  ${COMMON};
  ${sx};
`

UnderlineNavLink.displayName = 'UnderlineNav.Link'

export type UnderlineNavLinkProps = ComponentProps<typeof UnderlineNavLink>
export default Object.assign(UnderlineNav, {Link: UnderlineNavLink})
