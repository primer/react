import classnames from 'classnames'
import {Location} from 'history'
import React from 'react'
import styled from 'styled-components'
import {get} from './constants'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

const ITEM_CLASS = 'UnderlineNav-item'
const SELECTED_CLASS = 'selected'

const UnderlineNavBase = styled.nav<SxProp>`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${get('colors.border.muted')};
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
  to?: Location
  selected?: boolean
} & SxProp

const UnderlineNavLink = styled.a.attrs<StyledUnderlineNavLinkProps>(props => ({
  activeClassName: typeof props.to === 'string' ? 'selected' : '',
  className: classnames(ITEM_CLASS, props.selected && SELECTED_CLASS, props.className)
}))<StyledUnderlineNavLinkProps>`
  padding: ${get('space.3')} ${get('space.2')};
  margin-right: ${get('space.3')};
  font-size: ${get('fontSizes.1')};
  line-height: ${get('lineHeights.default')};
  color: ${get('colors.fg.default')};
  text-align: center;
  border-bottom: 2px solid transparent;
  text-decoration: none;

  &:hover,
  &:focus {
    color: ${get('colors.fg.default')};
    text-decoration: none;
    border-bottom-color: ${get('colors.neutral.muted')};
    transition: 0.2s ease;

    .UnderlineNav-octicon {
      color: ${get('colors.fg.muted')};
    }
  }

  &.selected {
    color: ${get('colors.fg.default')};
    border-bottom-color: ${get('colors.primer.border.active')};

    .UnderlineNav-octicon {
      color: ${get('colors.fg.default')};
    }
  }

  ${sx};
`

UnderlineNavLink.displayName = 'UnderlineNav.Link'

export type UnderlineNavLinkProps = ComponentProps<typeof UnderlineNavLink>
export default Object.assign(UnderlineNav, {Link: UnderlineNavLink})
