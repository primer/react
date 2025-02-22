import {clsx} from 'clsx'
import type {To} from 'history'
import React from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'
import {useFeatureFlag} from '../FeatureFlags'

import styles from './SubNav.module.css'

const CSS_MODULES_FEATURE_FLAG = 'primer_react_css_modules_ga'

type StyledSubNavProps = React.ComponentProps<'nav'> & {
  actions?: React.ReactNode
  align?: 'right'
  full?: boolean
  label?: string
} & SxProp
type StyledSubNavLinksProps = React.ComponentProps<'div'> & SxProp
type StyledSubNavLinkProps = React.ComponentProps<'a'> & SxProp & {to?: To; selected?: boolean}

// SubNav

const StyledSubNav = toggleStyledComponent(
  CSS_MODULES_FEATURE_FLAG,
  'nav',
  styled.nav<SxProp>`
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
  `,
)

const SubNav = React.forwardRef<HTMLElement, StyledSubNavProps>(function SubNav(
  {actions, className, children, label, ...rest},
  forwardRef,
) {
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)
  return (
    <StyledSubNav
      ref={forwardRef}
      className={clsx(className, 'SubNav', {[styles.SubNav]: enabled})}
      aria-label={label}
      {...rest}
    >
      <div className={clsx('SubNav-body', {[styles.Body]: enabled})}>{children}</div>
      {actions && <div className={clsx('SubNav-actions', {[styles.Actions]: enabled})}>{actions}</div>}
    </StyledSubNav>
  )
})
SubNav.displayName = 'SubNav'

// SubNav.Links

const StyledSubNavLinks = toggleStyledComponent(
  CSS_MODULES_FEATURE_FLAG,
  'div',
  styled.div<SubNavLinksProps>`
    display: flex;
    ${sx};
  `,
)

const SubNavLinks = React.forwardRef<HTMLElement, StyledSubNavLinksProps>(function SubNavLink(
  {children, className, ...rest},
  forwardRef,
) {
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)
  return (
    <StyledSubNavLinks ref={forwardRef} className={clsx(className, enabled && styles.Links)} {...rest}>
      {children}
    </StyledSubNavLinks>
  )
})
SubNavLinks.displayName = 'SubNav.Links'

// SubNav.Link

const StyledSubNavLink = toggleStyledComponent(
  CSS_MODULES_FEATURE_FLAG,
  'a',
  styled.a.attrs<StyledSubNavLinkProps>(props => ({
    className: clsx('SubNav-item', props.selected && 'selected', props.className),
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
    }

    &.selected {
      color: ${get('colors.fg.onEmphasis')};
      background-color: ${get('colors.accent.emphasis')};
      border-color: ${get('colors.accent.emphasis')};
    }

    ${sx};
  `,
)

const SubNavLink = React.forwardRef<HTMLElement, StyledSubNavLinkProps>(function SubNavLink(
  {children, className, ...rest},
  forwardRef,
) {
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)
  return (
    <StyledSubNavLink
      ref={forwardRef}
      className={clsx(className, enabled && styles.Link)}
      data-selected={rest.selected}
      aria-current={rest.selected}
      {...rest}
    >
      {children}
    </StyledSubNavLink>
  )
})

SubNavLink.displayName = 'SubNav.Link'

export type SubNavProps = ComponentProps<typeof SubNav>
export type SubNavLinksProps = ComponentProps<typeof SubNavLinks>
export type SubNavLinkProps = ComponentProps<typeof SubNavLink>
export default Object.assign(SubNav, {Link: SubNavLink, Links: SubNavLinks})
