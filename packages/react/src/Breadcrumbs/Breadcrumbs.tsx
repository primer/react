import {clsx} from 'clsx'
import type {To} from 'history'
import React from 'react'
import styled from 'styled-components'
import Box from '../Box'
import {get} from '../constants'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'
import classes from './Breadcrumbs.module.css'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'
import {useFeatureFlag} from '../FeatureFlags'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

const SELECTED_CLASS = 'selected'
const CSS_MODULES_FLAG = 'primer_react_css_modules_ga'

const Wrapper = toggleStyledComponent(
  CSS_MODULES_FLAG,
  'li',
  styled.li`
    display: inline-block;
    white-space: nowrap;
    list-style: none;
    &::after {
      font-size: ${get('fontSizes.1')};
      content: '';
      display: inline-block;
      height: 0.8em;
      margin: 0 0.5em;
      border-right: 0.1em solid;
      border-color: ${get('colors.fg.muted')};
      transform: rotate(15deg) translateY(0.0625em);
    }
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      &::after {
        content: none;
      }
    }
  `,
)

const BreadcrumbsBase = toggleStyledComponent(
  CSS_MODULES_FLAG,
  'nav',
  styled.nav<SxProp>`
    display: flex;
    justify-content: space-between;
    ${sx};
  `,
)

export type BreadcrumbsProps = React.PropsWithChildren<
  {
    className?: string
  } & SxProp
>

const BreadcrumbsList = ({children}: React.PropsWithChildren) => {
  const enabled = useFeatureFlag(CSS_MODULES_FLAG)
  if (enabled) {
    return <ol className={classes.BreadcrumbsList}>{children}</ol>
  }

  return (
    <Box as="ol" my={0} pl={0}>
      {children}
    </Box>
  )
}

function Breadcrumbs({className, children, sx: sxProp}: React.PropsWithChildren<BreadcrumbsProps>) {
  const enabled = useFeatureFlag(CSS_MODULES_FLAG)
  const wrappedChildren = React.Children.map(children, child => (
    <Wrapper className={clsx({[classes.ItemWrapper]: enabled})}>{child}</Wrapper>
  ))
  return (
    <BreadcrumbsBase
      className={clsx(className, {[classes.BreadcrumbsBase]: enabled})}
      aria-label="Breadcrumbs"
      sx={sxProp}
    >
      <BreadcrumbsList>{wrappedChildren}</BreadcrumbsList>
    </BreadcrumbsBase>
  )
}

type StyledBreadcrumbsItemProps = {
  to?: To
  selected?: boolean
  className?: string
} & SxProp &
  React.ComponentPropsWithoutRef<'a'>

const StyledBreadcrumbsItem = toggleStyledComponent(
  CSS_MODULES_FLAG,
  'a',
  styled.a`
    color: ${get('colors.accent.fg')};
    display: inline-block;
    font-size: ${get('fontSizes.1')};
    text-decoration: none;
    &:hover,
    &:focus {
      text-decoration: underline;
    }
    &.selected {
      color: ${get('colors.fg.default')};
      pointer-events: none;
    }
    &.selected:focus {
      text-decoration: none;
    }
    ${sx};
  `,
)

const BreadcrumbsItem = React.forwardRef(({selected, className, ...rest}, ref) => {
  const enabled = useFeatureFlag(CSS_MODULES_FLAG)
  return (
    <StyledBreadcrumbsItem
      className={clsx(className, {
        [SELECTED_CLASS]: selected,
        [classes.Item]: enabled,
        [classes.ItemSelected]: enabled && selected,
      })}
      aria-current={selected ? 'page' : null}
      ref={ref}
      {...rest}
    />
  )
}) as PolymorphicForwardRefComponent<'a', StyledBreadcrumbsItemProps>

Breadcrumbs.displayName = 'Breadcrumbs'

BreadcrumbsItem.displayName = 'Breadcrumbs.Item'

export type BreadcrumbsItemProps = ComponentProps<typeof BreadcrumbsItem>
export default Object.assign(Breadcrumbs, {Item: BreadcrumbsItem})

/**
 * @deprecated Use the `Breadcrumbs` component instead (i.e. `<Breadcrumb>` → `<Breadcrumbs>`)
 */
export const Breadcrumb = Object.assign(Breadcrumbs, {Item: BreadcrumbsItem})

/**
 * @deprecated Use the `BreadcrumbsProps` type instead
 */
export type BreadcrumbProps = ComponentProps<typeof BreadcrumbsBase>

/**
 * @deprecated Use the `BreadcrumbsItemProps` type instead
 */
export type BreadcrumbItemProps = ComponentProps<typeof BreadcrumbsItem>
