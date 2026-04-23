import type React from 'react'
import type {
  PageLayoutContentProps,
  PageLayoutFooterProps,
  PageLayoutHeaderProps,
  PageLayoutSidebarProps,
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
        sidebar: Sidebar,
      }}
      {...props}
    />
  )
}

Root.displayName = 'FilteredListLayout'

// ----------------------------------------------------------------------------
// FilteredListLayout.Header
//
// Thin wrapper around PageLayout.Header with FilteredListLayout's preferred
// defaults. Consumers compose the header contents themselves for v1; an
// opinionated title/actions API may return in a future revision.

export type FilteredListLayoutHeaderProps = PageLayoutHeaderProps

export const Header: React.FC<React.PropsWithChildren<FilteredListLayoutHeaderProps>> = ({
  padding = 'normal',
  divider = 'none',
  ...props
}) => {
  // eslint-disable-next-line primer-react/direct-slot-children
  return <PageLayout.Header padding={padding} divider={divider} {...props} />
}

Header.displayName = 'FilteredListLayout.Header'

// ----------------------------------------------------------------------------
// FilteredListLayout.Sidebar
//
// Wraps PageLayout.Sidebar so the filtered-list sidebar runs full height on
// the left of the page (above and below Header/Content/Footer), with sticky
// behaviour by default. Future: hide affordance at the bottom (per epic
// #2156 DoD).

export type FilteredListLayoutSidebarProps = PageLayoutSidebarProps

export const Sidebar: React.FC<React.PropsWithChildren<FilteredListLayoutSidebarProps>> = ({
  position = 'start',
  sticky = true,
  padding = 'condensed',
  divider = 'line',
  children,
  ...props
}) => {
  // Note: PageLayout.Sidebar's `padding` prop sets a CSS variable but its
  // stylesheet does not currently consume it, so we apply padding ourselves
  // via a wrapper element. We still forward `padding` to PageLayout.Sidebar
  // for forward-compatibility once the upstream styles consume it.
  return (
    <PageLayout.Sidebar position={position} sticky={sticky} padding={padding} divider={divider} {...props}>
      <div style={{padding: `var(--spacing-${padding})`}}>{children}</div>
    </PageLayout.Sidebar>
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
// FilteredListLayout.FilterBar
//
// Slot for filter input UI. Lives inside FilteredListLayout.Content, above the
// results region. v1 is a thin wrapper — consumers bring their own filter UI.
// Conventions for spacing, sticky behaviour, etc. can be added here later
// without changing the consumer-facing API.

export type FilteredListLayoutFilterBarProps = {
  className?: string
  'aria-label'?: string
}

export const FilterBar: React.FC<React.PropsWithChildren<FilteredListLayoutFilterBarProps>> = ({children, ...rest}) => {
  return <div {...rest}>{children}</div>
}

FilterBar.displayName = 'FilteredListLayout.FilterBar'

// ----------------------------------------------------------------------------
// FilteredListLayout.Results
//
// Slot for the actual filtered results (issue list, PR list, etc). Lives
// inside FilteredListLayout.Content, below FilterBar. Thin wrapper for v1 so
// we can hang spacing / virtualization conventions on it later without
// changing the consumer-facing API.

export type FilteredListLayoutResultsProps = {
  className?: string
  'aria-label'?: string
}

export const Results: React.FC<React.PropsWithChildren<FilteredListLayoutResultsProps>> = ({children, ...rest}) => {
  return (
    <div style={{marginBlockStart: 'var(--stack-gap-normal, 16px)'}} {...rest}>
      {children}
    </div>
  )
}

Results.displayName = 'FilteredListLayout.Results'

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
  FilterBar,
  Results,
  Footer,
})
