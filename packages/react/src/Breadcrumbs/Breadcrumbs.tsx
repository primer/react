import clsx from 'clsx'
import type {To} from 'history'
import React from 'react'
import styled from 'styled-components'
import Box from '../Box'
import {get} from '../constants'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'

const SELECTED_CLASS = 'selected'

const Wrapper = styled.li`
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
`

const BreadcrumbsBase = styled.nav<SxProp>`
  display: flex;
  justify-content: space-between;
  ${sx};
`

export type BreadcrumbsProps = React.PropsWithChildren<
  {
    className?: string
  } & SxProp
>

function Breadcrumbs({className, children, sx: sxProp}: React.PropsWithChildren<BreadcrumbsProps>) {
  const wrappedChildren = React.Children.map(children, child => <Wrapper>{child}</Wrapper>)
  return (
    <BreadcrumbsBase className={className} aria-label="Breadcrumbs" sx={sxProp}>
      <Box as="ol" my={0} pl={0}>
        {wrappedChildren}
      </Box>
    </BreadcrumbsBase>
  )
}

type StyledBreadcrumbsItemProps = {
  to?: To
  selected?: boolean
} & SxProp

const BreadcrumbsItem = styled.a.attrs<StyledBreadcrumbsItemProps>(props => ({
  className: clsx(props.selected && SELECTED_CLASS, props.className),
  'aria-current': props.selected ? 'page' : null,
}))<StyledBreadcrumbsItemProps>`
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
`

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
