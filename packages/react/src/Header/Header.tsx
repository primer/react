import type {Location, Pathname} from 'history'
import styled, {css} from 'styled-components'
import {get} from '../constants'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'
import {useFeatureFlag} from '../FeatureFlags'
import React from 'react'
import {clsx} from 'clsx'
import classes from './Header.module.css'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

type StyledHeaderProps = React.ComponentProps<'header'> & SxProp
type StyledHeaderItemProps = React.ComponentProps<'div'> & SxProp & {full?: boolean}
type StyledHeaderLinkProps = React.ComponentProps<'a'> & SxProp & {to?: Location | Pathname}

const CSS_MODULES_FEATURE_FLAG = 'primer_react_css_modules_ga'

const StyledHeader = toggleStyledComponent(
  CSS_MODULES_FEATURE_FLAG,
  'header',
  styled.header<StyledHeaderProps>`
    z-index: 32;
    display: flex;
    padding: ${get('space.3')};
    font-size: ${get('fontSizes.1')};
    line-height: ${get('lineHeights.default')};
    color: ${get('colors.header.text')};
    background-color: ${get('colors.header.bg')};
    align-items: center;
    flex-wrap: nowrap;
    overflow: auto;

    ${sx};
  `,
)

const Header = React.forwardRef<HTMLElement, StyledHeaderProps>(function Header(
  {children, className, ...rest},
  forwardRef,
) {
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)
  return (
    <StyledHeader ref={forwardRef} className={clsx(className, {[classes.Header]: enabled})} {...rest}>
      {children}
    </StyledHeader>
  )
}) as PolymorphicForwardRefComponent<'header', StyledHeaderProps>

Header.displayName = 'Header'

const StyledHeaderItem = toggleStyledComponent(
  CSS_MODULES_FEATURE_FLAG,
  'div',
  styled.div<StyledHeaderItemProps>`
    display: flex;
    margin-right: ${get('space.3')};
    align-self: stretch;
    align-items: center;
    flex-wrap: nowrap;

    ${({full}) =>
      full &&
      css`
        flex: auto;
      `};

    ${sx};
  `,
)

const HeaderItem = React.forwardRef<HTMLElement, StyledHeaderItemProps>(function HeaderItem(
  {children, className, ...rest},
  forwardRef,
) {
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)
  return (
    <StyledHeaderItem
      ref={forwardRef}
      className={clsx(className, enabled && classes.HeaderItem)}
      data-full={rest.full}
      {...rest}
    >
      {children}
    </StyledHeaderItem>
  )
})

HeaderItem.displayName = 'Header.Item'

const StyledHeaderLink = toggleStyledComponent(
  CSS_MODULES_FEATURE_FLAG,
  'a',
  styled.a.attrs<StyledHeaderLinkProps>(({to}) => {
    const isReactRouter = typeof to === 'string'
    if (isReactRouter) {
      // according to their docs, NavLink supports aria-current:
      // https://reacttraining.com/react-router/web/api/NavLink/aria-current-string
      return {'aria-current': 'page'}
    } else {
      return {}
    }
  })<StyledHeaderLinkProps>`
    font-weight: ${get('fontWeights.bold')};
    color: ${get('colors.header.logo')};
    white-space: nowrap;
    cursor: pointer;
    text-decoration: none;
    display: flex;
    align-items: center;

    &:hover,
    &:focus {
      color: ${get('colors.header.text')};
    }

    ${sx};
  `,
)

const HeaderLink = React.forwardRef<HTMLElement, StyledHeaderLinkProps>(function HeaderLink(
  {children, className, ...rest},
  forwardRef,
) {
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)
  return (
    <StyledHeaderLink ref={forwardRef} className={clsx(className, enabled && classes.HeaderLink)} {...rest}>
      {children}
    </StyledHeaderLink>
  )
})

HeaderLink.displayName = 'Header.Link'

export type HeaderProps = ComponentProps<typeof Header>
export type HeaderLinkProps = ComponentProps<typeof HeaderLink>
export type HeaderItemProps = ComponentProps<typeof HeaderItem>
export default Object.assign(Header, {Link: HeaderLink, Item: HeaderItem})
