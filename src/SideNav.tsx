import classnames from 'classnames'
import * as History from 'history'
import React from 'react'
import styled, {css} from 'styled-components'
import BorderBox from './BorderBox'
import {COMMON, get} from './constants'
import Link from './Link'
import sx from './sx'
import theme from './theme'
import {ComponentProps} from './utils/types'

type SideNavBaseProps = {
  variant?: 'lightweight' | 'normal'
  bordered?: boolean
} & ComponentProps<typeof BorderBox>

function SideNavBase({variant, className, bordered, children, ...props}: SideNavBaseProps) {
  const variantClassName = variant === 'lightweight' ? 'lightweight' : 'normal'
  const newClassName = classnames(className, `variant-${variantClassName}`)

  if (!bordered) {
    props = {...props, borderWidth: 0}
  }

  return (
    <BorderBox as="nav" className={newClassName} {...props}>
      {children}
    </BorderBox>
  )
}

const SideNav = styled(SideNavBase)`
  background-color: ${get('colors.white')};

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

  ${COMMON};
  ${sx};
`
type StyledSideNavLinkProps = {
  to?: History.LocationDescriptor
  selected?: boolean
  variant?: 'full' | 'normal'
}

const SideNavLink = styled(Link).attrs<StyledSideNavLinkProps>(props => {
  const isReactRouter = typeof props.to === 'string'
  if (isReactRouter || props.selected) {
    // according to their docs, NavLink supports aria-current:
    // https://reacttraining.com/react-router/web/api/NavLink/aria-current-string
    return {'aria-current': 'page'}
  } else {
    return {}
  }
})<StyledSideNavLinkProps>`
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

  &:first-child {
    border-top-right-radius: ${get('radii.2')};
    border-top-left-radius: ${get('radii.2')};
  }

  &:last-child {
    border-bottom-right-radius: ${get('radii.2')};
    border-bottom-left-radius: ${get('radii.2')};
  }

  ${SideNav}.variant-normal > & {
    color: ${get('colors.gray.6')};
    padding: ${get('space.3')};
    border: 0;
    border-top: ${get('borderWidths.1')} solid ${get('colors.gray.2')};

    &:first-child {
      border-top: 0;
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

    &:hover,
    &:focus {
      color: ${get('colors.gray.9')};
      text-decoration: none;
      background-color: ${get('colors.gray.1')};
      outline: none;
    }

    &[aria-current='page'],
    &[aria-selected='true'] {
      font-weight: ${get('fontWeights.semibold')};
      color: ${get('colors.gray.9')};

      // Bar on the left
      &::before {
        background-color: ${get('colors.accent')};
      }
    }
  }

  ${SideNav}.variant-lightweight > & {
    padding: ${get('space.1')} 0;
    color: ${get('colors.blue.5')};

    &:hover,
    &:focus {
      color: ${get('colors.gray.9')};
      text-decoration: none;
      outline: none;
    }

    &[aria-current='page'],
    &[aria-selected='true'] {
      color: ${get('colors.gray.9')};
      font-weight: ${get('fontWeights.semibold')};
    }
  }

  ${sx};
`

SideNav.defaultProps = {
  theme,
  variant: 'normal'
}

SideNavLink.defaultProps = {
  theme,
  variant: 'normal'
}

SideNavLink.displayName = 'SideNav.Link'

export type SideNavProps = ComponentProps<typeof SideNav>
export type SideNavLinksProps = ComponentProps<typeof SideNavLink>

export default Object.assign(SideNav, {Link: SideNavLink})
