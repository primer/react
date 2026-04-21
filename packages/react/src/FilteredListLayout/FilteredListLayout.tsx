import type React from 'react'
import Heading from '../Heading'
import type {PageLayoutContentProps, PageLayoutFooterProps, PageLayoutPaneProps} from '../PageLayout'
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
        footer: Footer,
      }}
      {...props}
    />
  )
}

Root.displayName = 'FilteredListLayout'

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
// FilteredListLayout.Header
//
// Lives inside FilteredListLayout.Content as the top row: page title on the
// left, primary action(s) on the right. Mirrors the Application template
// pattern from github-ui (title is an h2 inside the content region, not the
// global page title — that's PageLayout.Header territory and not used here).

export type FilteredListLayoutHeaderProps = {
  title: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export const Header: React.FC<FilteredListLayoutHeaderProps> = ({title, actions, className}) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--stack-gap-condensed, 8px)',
        marginBlockEnd: 'var(--stack-gap-normal, 16px)',
      }}
    >
      <Heading as="h2" sx={{fontSize: 3}}>
        {title}
      </Heading>
      {actions ? (
        <div style={{display: 'flex', alignItems: 'center', gap: 'var(--stack-gap-condensed, 8px)'}}>{actions}</div>
      ) : null}
    </div>
  )
}

Header.displayName = 'FilteredListLayout.Header'

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

export const FilterBar: React.FC<React.PropsWithChildren<FilteredListLayoutFilterBarProps>> = ({
  children,
  ...rest
}) => {
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
  Sidebar,
  Content,
  Header,
  FilterBar,
  Results,
  Footer,
})
