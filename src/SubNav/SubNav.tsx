import clsx from 'clsx'
import {To} from 'history'
import React from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'

const ITEM_CLASS = 'SubNav-item'
const SELECTED_CLASS = 'selected'

const SubNavBase = styled.nav<SxProp>`
  display: flex;
  justify-content: space-between;

  .SubNav-body {
    display: flex;
    margin-bottom: -1px;

    > * {
      margin-left: ${get('space.2')};
    }

    > *:first-child {
      margin-left: 0;
    }
  }

  .SubNav-actions {
    align-self: center;
  }

  ${sx};
`

export type SubNavProps = {
  actions?: React.ReactNode
  align?: 'right'
  full?: boolean
  label?: string
} & ComponentProps<typeof SubNavBase>

function SubNav({actions, className, children, label, ...rest}: SubNavProps) {
  const classes = clsx(className, 'SubNav')
  return (
    <SubNavBase className={classes} aria-label={label} {...rest}>
      <div className="SubNav-body">{children}</div>
      {actions && <div className="SubNav-actions">{actions}</div>}
    </SubNavBase>
  )
}

export type SubNavLinksProps = SxProp

const SubNavLinks = styled.div<SubNavLinksProps>`
  display: flex;
  ${sx};
`

type StyledSubNavLinkProps = {
  to?: To
  selected?: boolean
} & SxProp

const SubNavLink = styled.a.attrs<StyledSubNavLinkProps>(props => ({
  activeClassName: typeof props.to === 'string' ? 'selected' : undefined,
  className: clsx(ITEM_CLASS, props.selected && SELECTED_CLASS, props.className),
}))<StyledSubNavLinkProps>`
  padding-left: ${get('space.3')};
  padding-right: ${get('space.3')};
  font-weight: ${get('fontWeights.semibold')};
  font-size: ${get('fontSizes.1')};
  line-height: 20px; //custom value for SubNav
  min-height: 34px; //custom value for SubNav
  color: ${get('colors.fg.default')};
  text-align: center;
  text-decoration: none;
  border-top: 1px solid ${get('colors.border.default')};
  border-bottom: 1px solid ${get('colors.border.default')};
  border-right: 1px solid ${get('colors.border.default')};
  display: flex;
  align-items: center;

  &:first-of-type {
    border-top-left-radius: ${get('radii.2')};
    border-bottom-left-radius: ${get('radii.2')};
    border-left: 1px solid ${get('colors.border.default')};
  }

  &:last-of-type {
    border-top-right-radius: ${get('radii.2')};
    border-bottom-right-radius: ${get('radii.2')};
  }

  &:hover,
  &:focus {
    text-decoration: none;
    background-color: ${get('colors.canvas.subtle')};
    transition: background-color 0.2s ease;

    .SubNav-octicon {
      color: ${get('colors.fg.muted')};
    }
  }

  &.selected {
    color: ${get('colors.fg.onEmphasis')};
    background-color: ${get('colors.accent.emphasis')};
    border-color: ${get('colors.accent.emphasis')};
    .SubNav-octicon {
      color: ${get('colors.fg.onEmphasis')};
    }
  }

  ${sx};
`

SubNavLink.displayName = 'SubNav.Link'

SubNavLinks.displayName = 'SubNav.Links'

export type SubNavLinkProps = ComponentProps<typeof SubNavLink>
export default Object.assign(SubNav, {Link: SubNavLink, Links: SubNavLinks})
