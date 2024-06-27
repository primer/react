import clsx from 'clsx'
import type {To} from 'history'
import React from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'

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
  /** Place another element, such as a button, to the opposite side of the navigation items. */
  actions?: React.ReactNode
  /** Use `right` to have navigation items aligned right. */
  align?: 'right'
  /** Used to make navigation fill the width of the container. */
  full?: boolean
  /** Used to set the `aria-label` on the top level `<nav>` element. */
  label?: string
} & ComponentProps<typeof SubNavBase>

/**
 * Use the sub nav component for navigation on a dashboard-type interface with another set of navigation components above it.
 * @primerid sub_nav
 * @primerstatus alpha
 * @primera11yreviewed false
 */
export function SubNav({actions, className, children, label, ...rest}: SubNavProps) {
  const classes = clsx(className, 'SubNav')
  return (
    <SubNavBase className={classes} aria-label={label} {...rest}>
      <div className="SubNav-body">{children}</div>
      {actions && <div className="SubNav-actions">{actions}</div>}
    </SubNavBase>
  )
}

export type SubNavLinksProps = SxProp

/**
 * Container for the set of links in the SubNav.
 * @alias SubNav.Links
 * @primerparentid sub_nav
 */
export const SubNavLinks = styled.div<SubNavLinksProps>`
  display: flex;
  ${sx};
`

type StyledSubNavLinkProps = {
  /** Used when the item is rendered using a component like React Router's `Link`. The path to navigate to. */
  to?: To
  /** Whether this item represents the current page */
  selected?: boolean
} & SxProp

/**
 * An individual link in the SubNav.
 * @alias SubNav.Link
 * @primerparentid sub_nav
 */
export const SubNavLink = styled.a.attrs<StyledSubNavLinkProps>(props => ({
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

export type SubNavLinkProps = ComponentProps<typeof SubNavLink>
