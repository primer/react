import {To} from 'history'

import {get} from './constants'
import styled, {css} from 'styled-components'

import Box from './Box'
import {ComponentProps} from './utils/types'
import Link from './Link'
import React from 'react'
import clsx from 'clsx'
import sx, {SxProp} from './sx'

type SideNavBaseProps = {
  variant?: 'lightweight' | 'normal'
  bordered?: boolean
  className?: string
  children?: React.ReactNode
  'aria-label'?: string
}

function SideNavBase({variant = 'normal', className, bordered, children, 'aria-label': ariaLabel}: SideNavBaseProps) {
  const variantClassName = variant === 'lightweight' ? 'lightweight' : 'normal'
  const newClassName = clsx(className, `variant-${variantClassName}`)

  return (
    <Box
      borderWidth={bordered ? '1px' : 0}
      borderStyle="solid"
      borderColor="border.default"
      borderRadius={2}
      as="nav"
      className={newClassName}
      aria-label={ariaLabel}
    >
      {children}
    </Box>
  )
}

const SideNav = styled(SideNavBase)<SxProp>`
  background-color: ${get('colors.canvas.subtle')};

  ${props =>
    props.bordered &&
    css`
      // Remove duplicate borders from nested SideNavs
      & > & {
        border-left: 0;
        border-right: 0;
        border-bottom: 0;
      }
    `}

  ${sx};
`
type StyledSideNavLinkProps = {
  to?: To
  selected?: boolean
  variant?: 'full' | 'normal'
}

// used for variant normal hover, focus pseudo selectors
const CommonAccessibilityVariantNormalStyles = css`
  background-color: ${get('colors.neutral.subtle')};
  text-decoration: none;
`

// used for light weight hover, focus pseudo selectors
const CommonAccessibilityVariantLightWeightStyles = css`
  color: ${get('colors.fg.default')};
  text-decoration: none;
`

const SideNavLink = styled(Link).attrs<StyledSideNavLinkProps>(props => {
  const isReactRouter = typeof props.to === 'string'
  if (isReactRouter || props.selected) {
    // according to their docs, NavLink supports aria-current:
    // https://reacttraining.com/react-router/web/api/NavLink/aria-current-string
    return {'aria-current': 'page'}
  } else {
    return {}
  }
})<StyledSideNavLinkProps & SxProp>`
  position: relative;
  display: block;
  ${props =>
    props.variant === 'full' &&
    css`
      display: flex;
      align-items: center;
      justify-content: space-between;
    `}
  width: 100%;
  text-align: left;
  font-size: ${get('fontSizes.1')};

  & > ${SideNav} {
    border-bottom: none;
  }

  ${SideNav}.variant-normal > & {
    color: ${get('colors.fg.default')};
    padding: ${get('space.3')};
    border: 0;
    border-top: ${get('borderWidths.1')} solid ${get('colors.border.muted')};

    &:first-child {
      border-top: 0;
      border-top-right-radius: ${get('radii.2')};
      border-top-left-radius: ${get('radii.2')};
    }

    &:last-child {
      border-bottom-right-radius: ${get('radii.2')};
      border-bottom-left-radius: ${get('radii.2')};
    }

    // Bar on the left
    &::before {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
      width: 3px;
      pointer-events: none;
      content: '';
    }

    &:hover {
      ${CommonAccessibilityVariantNormalStyles}
    }

    &:focus {
      ${CommonAccessibilityVariantNormalStyles}
      outline: solid 2px ${get('colors.accent.fg')};
      z-index: 1;
    }

    &[aria-current='page'],
    &[aria-selected='true'] {
      background-color: ${get('colors.sidenav.selectedBg')};

      // Bar on the left
      &::before {
        background-color: ${get('colors.primer.border.active')};
      }
    }
  }

  ${SideNav}.variant-lightweight > & {
    padding: ${get('space.1')} 0;
    color: ${get('colors.accent.fg')};

    &:hover {
      ${CommonAccessibilityVariantLightWeightStyles}
    }

    &:focus {
      ${CommonAccessibilityVariantLightWeightStyles}
      outline: solid 1px ${get('colors.accent.fg')};
      z-index: 1;
    }

    &[aria-current='page'],
    &[aria-selected='true'] {
      color: ${get('colors.fg.default')};
      font-weight: ${get('fontWeights.semibold')};
    }
  }

  ${sx};
`

SideNavLink.displayName = 'SideNav.Link'

export type SideNavProps = ComponentProps<typeof SideNav>
export type SideNavLinkProps = ComponentProps<typeof SideNavLink>

/** @deprecated Use [NavList](https://primer.style/react/NavList) instead */
export default Object.assign(SideNav, {Link: SideNavLink})
