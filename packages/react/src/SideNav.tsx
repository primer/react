import type {To} from 'history'
import styled, {css} from 'styled-components'

import Box from './Box'
import type {ComponentProps} from './utils/types'
import Link from './Link'
import React from 'react'
import {clsx} from 'clsx'
import type {SxProp} from './sx'
import sx from './sx'
import {toggleStyledComponent} from './internal/utils/toggleStyledComponent'
import classes from './SideNav.module.css'
import {useFeatureFlag} from './FeatureFlags'

const CSS_MODULES_FEATURE_FLAG = 'primer_react_css_modules_team'

type SideNavBaseProps = {
  as?: React.ElementType
  variant?: 'lightweight' | 'normal'
  bordered?: boolean
  className?: string
  children?: React.ReactNode
  'aria-label'?: string
} & SxProp

const StyledNav = toggleStyledComponent(
  CSS_MODULES_FEATURE_FLAG,
  'nav',
  styled(Box)<SideNavBaseProps>`
    background-color: var(--bgColor-muted);

    ${props =>
      props.bordered &&
      css`
        border-color: var(--borderColor-default);
        border-style: solid;
        border-width: var(--borderWidth-thin);
        border-radius: var(--borderRadius-medium);

        // Remove duplicate borders from nested SideNavs
        & > & {
          border-left: 0;
          border-right: 0;
          border-bottom: 0;
        }
      `}

    ${sx};
  `,
)

function SideNav({
  as = 'nav',
  variant = 'normal',
  className,
  bordered,
  children,
  'aria-label': ariaLabel,
  sx: sxProp,
}: SideNavBaseProps) {
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)
  const variantClassName = variant === 'lightweight' ? 'lightweight' : 'normal'
  const newClassName = clsx(
    {[classes.SideNav]: enabled, [classes.SideNavBordered]: enabled && bordered},
    'sidenav',
    className,
    `variant-${variantClassName}`,
  )
  return (
    <StyledNav
      as={as}
      bordered={enabled ? undefined : bordered}
      className={newClassName}
      aria-label={ariaLabel}
      sx={sxProp}
    >
      {children}
    </StyledNav>
  )
}

type StyledSideNavLinkProps = {
  to?: To
  selected?: boolean
  variant?: 'full' | 'normal'
}

// used for variant normal hover, focus pseudo selectors
const CommonAccessibilityVariantNormalStyles = css`
  background-color: var(--bgColor-neutral-muted);
  text-decoration: none;
`

// used for light weight hover, focus pseudo selectors
const CommonAccessibilityVariantLightWeightStyles = css`
  color: var(--fgColor-default);
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
  font-size: var(--base-size-14);

  & > .sidenav {
    border-bottom: none;
  }

  .sidenav.variant-normal > & {
    color: var(--fgColor-default);
    padding: var(--base-size-16);
    border: 0;
    border-top: var(--borderWidth-thin) solid var(--borderColor-muted);

    &:first-child {
      border-top: 0;
      border-top-right-radius: var(--borderRadius-medium);
      border-top-left-radius: var(--borderRadius-medium);
    }

    &:last-child {
      border-bottom-right-radius: var(--borderRadius-medium);
      border-bottom-left-radius: var(--borderRadius-medium);
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
      outline: solid 2px var(--fgColor-accent);
      z-index: 1;
    }

    &[aria-current='page'],
    &[aria-selected='true'] {
      background-color: var(--bgColor-default);

      // Bar on the left
      &::before {
        background-color: #fd8c73;
      }
    }
  }

  .sidenav.variant-lightweight > & {
    padding: var(--base-size-4) 0;
    color: var(--fgColor-accent);

    &:hover {
      ${CommonAccessibilityVariantLightWeightStyles}
    }

    &:focus {
      ${CommonAccessibilityVariantLightWeightStyles}
      outline: solid 1px var(--fgColor-accent);
      z-index: 1;
    }

    &[aria-current='page'],
    &[aria-selected='true'] {
      color: var(--fgColor-default);
      font-weight: var(--base-text-weight-medium);
    }
  }

  ${sx};
`

SideNavLink.displayName = 'SideNav.Link'

export type SideNavProps = ComponentProps<typeof SideNav>
export type SideNavLinkProps = ComponentProps<typeof SideNavLink>

/** @deprecated Use [NavList](https://primer.style/react/NavList) instead */
export default Object.assign(SideNav, {Link: SideNavLink})
