import clsx from 'clsx'
import {To} from 'history'
import React from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'
import getGlobalFocusStyles from '../internal/utils/getGlobalFocusStyles'

const ITEM_CLASS = 'PRC-UnderlineNav-item'
const SELECTED_CLASS = 'PRC-selected'

const UnderlineNavBase = styled.nav<SxProp>`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${get('colors.border.muted')};
  &.PRC-UnderlineNav--right {
    justify-content: flex-end;

    .PRC-UnderlineNav-item {
      margin-right: 0;
      margin-left: ${get('space.3')};
    }

    .PRC-UnderlineNav-actions {
      flex: 1 1 auto;
    }
  }
  &.PRC-UnderlineNav--full {
    display: block;
  }

  .PRC-UnderlineNav-body {
    display: flex;
    margin-bottom: -1px;
  }

  .PRC-UnderlineNav-actions {
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
  const classes = clsx(
    className,
    'PRC-UnderlineNav',
    align && `PRC-UnderlineNav--${align}`,
    full && 'PRC-UnderlineNav--full',
  )
  return (
    <UnderlineNavBase className={classes} aria-label={label} theme={theme} {...rest}>
      <div className="PRC-UnderlineNav-body">{children}</div>
      {actions && <div className="PRC-UnderlineNav-actions">{actions}</div>}
    </UnderlineNavBase>
  )
}

type StyledUnderlineNavLinkProps = {
  to?: To
  selected?: boolean
} & SxProp

const UnderlineNavLink = styled.a.attrs<StyledUnderlineNavLinkProps>(props => ({
  activeClassName: typeof props.to === 'string' ? 'selected' : undefined,
  className: clsx(ITEM_CLASS, props.selected && SELECTED_CLASS, props.className),
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
    transition: border-bottom-color 0.2s ease;

    .PRC-UnderlineNav-octicon {
      color: ${get('colors.fg.muted')};
    }
  }

  &.PRC-selected {
    color: ${get('colors.fg.default')};
    border-bottom-color: ${get('colors.primer.border.active')};

    .PRC-UnderlineNav-octicon {
      color: ${get('colors.fg.default')};
    }
  }

  ${getGlobalFocusStyles('-8px')};

  ${sx};
`

UnderlineNavLink.displayName = 'UnderlineNav.Link'

export type UnderlineNavLinkProps = ComponentProps<typeof UnderlineNavLink>
/**
 * @deprecated UnderlineNav is deprecated and will be replaced by the draft `UnderlineNav` in the next major release. See https://primer.style/react/drafts/UnderlineNav2 for more details.
 */
export default Object.assign(UnderlineNav, {Link: UnderlineNavLink})
