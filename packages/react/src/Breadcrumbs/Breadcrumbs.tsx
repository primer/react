import {clsx} from 'clsx'
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

export interface BreadcrumbsProps extends React.PropsWithChildren, SxProp {
  className?: string
}

/**
 * Breadcrumbs display the current page or context within the site, allowing them to navigate different levels of the hierarchy.
 * @primerid breadcrumbs
 * @primerstatus alpha
 * @primera11yreviewed false
 */
export function Breadcrumbs({className, children, sx: sxProp}: BreadcrumbsProps) {
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
  /** Used when the item is rendered using a component like React Router's `Link`. The path to navigate to. */
  to?: To
  /** Whether this item represents the current page */
  selected?: boolean
} & SxProp

/**
 * Breadcrumbs.Item is used to represent each link in the Breadcrumbs component. The last item is not a link, it shows the current page.
 * @alias Breadcrumbs.Item
 * @primerparentid breadcrumbs
 */
export const BreadcrumbsItem = styled.a.attrs<StyledBreadcrumbsItemProps>(props => ({
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

/**
 * @deprecated Use the `BreadcrumbsProps` type instead
 */
export type BreadcrumbProps = ComponentProps<typeof BreadcrumbsBase>

/**
 * @deprecated Use the `BreadcrumbsItemProps` type instead
 */
export type BreadcrumbItemProps = ComponentProps<typeof BreadcrumbsItem>
