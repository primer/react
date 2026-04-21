import type React from 'react'
import type {
  PageLayoutContentProps,
  PageLayoutFooterProps,
  PageLayoutHeaderProps,
  PageLayoutPaneProps,
} from '../PageLayout'
import {PageLayout} from '../PageLayout'

// ----------------------------------------------------------------------------
// FilteredListLayout
//
// A page template for the common "sidebar + filter input + filtered results"
// shape used across GitHub (e.g. Issues, Pull requests, Discussions).
//
// Status: alpha. v1 mirrors SplitPageLayout's defaults — full-bleed, dividers
// on, sticky pane — but is its own component so we can grow filtered-list
// specific behaviour (sidebar hide affordance, primary action slot, filter
// bar / results sub-regions) without re-litigating SplitPageLayout's API.

export type FilteredListLayoutProps = {className?: string}

export const Root: React.FC<React.PropsWithChildren<FilteredListLayoutProps>> = props => {
  return (
    <PageLayout
      containerWidth="full"
      padding="none"
      columnGap="none"
      rowGap="none"
      _slotsConfig={{
        header: Header,
        footer: Footer,
      }}
      {...props}
    />
  )
}

Root.displayName = 'FilteredListLayout'

// ----------------------------------------------------------------------------
// FilteredListLayout.Header

export type FilteredListLayoutHeaderProps = PageLayoutHeaderProps

export const Header: React.FC<React.PropsWithChildren<FilteredListLayoutHeaderProps>> = ({
  padding = 'normal',
  divider = 'line',
  ...props
}) => {
  // eslint-disable-next-line primer-react/direct-slot-children
  return <PageLayout.Header padding={padding} divider={divider} {...props} />
}

Header.displayName = 'FilteredListLayout.Header'

// ----------------------------------------------------------------------------
// FilteredListLayout.Sidebar
//
// Wraps PageLayout.Pane with defaults appropriate for a filtered-list sidebar.
// Future: hide affordance at the bottom (per epic #2156 DoD).

export type FilteredListLayoutSidebarProps = PageLayoutPaneProps

export const Sidebar: React.FC<React.PropsWithChildren<FilteredListLayoutSidebarProps>> = ({
  position = 'start',
  sticky = true,
  padding = 'normal',
  divider = 'line',
  ...props
}) => {
  return (
    <PageLayout.Pane
      position={position}
      sticky={sticky}
      padding={padding}
      divider={divider}
      {...props}
    />
  )
}

Sidebar.displayName = 'FilteredListLayout.Sidebar'

// ----------------------------------------------------------------------------
// FilteredListLayout.Content
//
// Hosts the filter bar and results region. v1 is a single slot; future versions
// may introduce FilterBar and Results sub-components for opinionated layout.

export type FilteredListLayoutContentProps = PageLayoutContentProps

export const Content: React.FC<React.PropsWithChildren<FilteredListLayoutContentProps>> = ({
  width = 'xlarge',
  padding = 'normal',
  ...props
}) => {
  return <PageLayout.Content width={width} padding={padding} {...props} />
}

Content.displayName = 'FilteredListLayout.Content'

// ----------------------------------------------------------------------------
// FilteredListLayout.Footer

export type FilteredListLayoutFooterProps = PageLayoutFooterProps

export const Footer: React.FC<React.PropsWithChildren<FilteredListLayoutFooterProps>> = ({
  padding = 'normal',
  divider = 'line',
  ...props
}) => {
  // eslint-disable-next-line primer-react/direct-slot-children
  return <PageLayout.Footer padding={padding} divider={divider} {...props} />
}

Footer.displayName = 'FilteredListLayout.Footer'

// ----------------------------------------------------------------------------
// Export

export const FilteredListLayout = Object.assign(Root, {
  Header,
  Sidebar,
  Content,
  Footer,
})
