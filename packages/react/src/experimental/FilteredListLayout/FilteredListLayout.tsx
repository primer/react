import type React from 'react'
import {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react'
import {SidebarCollapseIcon} from '@primer/octicons-react'
import {IconButton} from '../../Button'
import {Hidden} from '../../Hidden'
import type {
  PageLayoutContentProps,
  PageLayoutFooterProps,
  PageLayoutHeaderProps,
  PageLayoutSidebarProps,
} from '../../PageLayout'
import {PageLayout} from '../../PageLayout'
import {Dialog} from '../../Dialog'

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

// ----------------------------------------------------------------------------
// Internal context
//
// Powers the responsive-by-default behaviour: on narrow viewports the inline
// Sidebar is hidden, and a trigger button + bottom-sheet Dialog rendered by
// Content takes its place. Sidebar registers its children into this context
// so the same NavList (or other content) renders in both places without the
// consumer having to author it twice.

type SidebarRegistration = {
  content: React.ReactNode
  ariaLabel?: string
  triggerLabel: string
}

type FilteredListLayoutContextValue = {
  registerSidebar: (registration: SidebarRegistration | null) => void
  sidebar: SidebarRegistration | null
  isSheetOpen: boolean
  openSheet: () => void
  closeSheet: () => void
}

const FilteredListLayoutContext = createContext<FilteredListLayoutContextValue | null>(null)

const useFilteredListLayoutContext = () => useContext(FilteredListLayoutContext)

// ----------------------------------------------------------------------------
// FilteredListLayout (Root)

export type FilteredListLayoutProps = {className?: string}

export const Root: React.FC<React.PropsWithChildren<FilteredListLayoutProps>> = props => {
  const [sidebar, setSidebar] = useState<SidebarRegistration | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Bail out when the next registration is shallow-equal to the current one.
  // Slot components re-run their registration effect on every render (because
  // `children` is a fresh ReactNode each render), so without this guard we'd
  // thrash state and trigger an infinite render loop.
  const registerSidebar = useCallback((next: SidebarRegistration | null) => {
    setSidebar(prev => {
      if (prev === next) return prev
      if (
        prev &&
        next &&
        prev.content === next.content &&
        prev.ariaLabel === next.ariaLabel &&
        prev.triggerLabel === next.triggerLabel
      ) {
        return prev
      }
      return next
    })
  }, [])

  const openSheet = useCallback(() => setIsSheetOpen(true), [])
  const closeSheet = useCallback(() => setIsSheetOpen(false), [])

  const value = useMemo<FilteredListLayoutContextValue>(
    () => ({
      registerSidebar,
      sidebar,
      isSheetOpen,
      openSheet,
      closeSheet,
    }),
    [registerSidebar, sidebar, isSheetOpen, openSheet, closeSheet],
  )

  return (
    <FilteredListLayoutContext.Provider value={value}>
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
    </FilteredListLayoutContext.Provider>
  )
}

Root.displayName = 'FilteredListLayout'

// ----------------------------------------------------------------------------
// FilteredListLayout.Header
//
// Thin wrapper around PageLayout.Header with FilteredListLayout's preferred
// defaults. On narrow viewports it also renders the trigger button + bottom
// sheet that surface the Sidebar's contents, so the responsive affordance
// always appears above the consumer-authored heading row.

export type FilteredListLayoutHeaderProps = PageLayoutHeaderProps

export const Header: React.FC<React.PropsWithChildren<FilteredListLayoutHeaderProps>> = ({
  padding = 'normal',
  divider = 'none',
  children,
  ...props
}) => {
  const ctx = useFilteredListLayoutContext()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const onClose = useCallback(() => ctx?.closeSheet(), [ctx])

  return (
    // eslint-disable-next-line primer-react/direct-slot-children
    <PageLayout.Header padding={padding} divider={divider} {...props}>
      {ctx?.sidebar ? (
        <Hidden when={['regular', 'wide']}>
          <div style={{marginBlockEnd: 'var(--stack-gap-condensed, 8px)'}}>
            <IconButton
              ref={triggerRef}
              icon={SidebarCollapseIcon}
              aria-label={ctx.sidebar.triggerLabel}
              onClick={ctx.openSheet}
              aria-haspopup="dialog"
              aria-expanded={ctx.isSheetOpen}
            />
          </div>
        </Hidden>
      ) : null}
      {ctx?.sidebar && ctx.isSheetOpen ? (
        <Dialog
          title={ctx.sidebar.ariaLabel ?? ctx.sidebar.triggerLabel}
          onClose={onClose}
          position={{narrow: 'bottom'}}
          returnFocusRef={triggerRef}
        >
          {ctx.sidebar.content}
        </Dialog>
      ) : null}
      {children}
    </PageLayout.Header>
  )
}

Header.displayName = 'FilteredListLayout.Header'

// ----------------------------------------------------------------------------
// FilteredListLayout.Sidebar
//
// Wraps PageLayout.Sidebar so the filtered-list sidebar runs full height on
// the start side of the page, sticky by default. Hidden on narrow viewports;
// its contents are surfaced in a bottom-sheet Dialog opened by a trigger
// button rendered by FilteredListLayout.Content.

export type FilteredListLayoutSidebarProps = PageLayoutSidebarProps & {
  /**
   * Accessible label for the narrow-viewport trigger button that opens
   * the sidebar contents in a bottom sheet, and the title shown above
   * the sheet. Defaults to "Open sidebar".
   */
  triggerLabel?: string
}

const SIDEBAR_HIDDEN_DEFAULT = {narrow: true, regular: false, wide: false} as const

export const Sidebar: React.FC<React.PropsWithChildren<FilteredListLayoutSidebarProps>> = ({
  position = 'start',
  sticky = true,
  padding = 'condensed',
  divider = 'line',
  hidden = SIDEBAR_HIDDEN_DEFAULT,
  triggerLabel = 'Open sidebar',
  children,
  'aria-label': ariaLabel,
  ...props
}) => {
  const ctx = useFilteredListLayoutContext()
  const registerSidebar = ctx?.registerSidebar

  // Register sidebar contents with the layout so Header can render them in a
  // bottom-sheet Dialog at narrow viewports. registerSidebar is stable and
  // performs its own shallow-equal bail-out, so this safely re-runs on every
  // render without causing an update loop.
  useEffect(() => {
    if (!registerSidebar) return
    registerSidebar({content: children, ariaLabel, triggerLabel})
    return () => registerSidebar(null)
  }, [registerSidebar, children, ariaLabel, triggerLabel])

  // Note: PageLayout.Sidebar's `padding` prop sets a CSS variable but its
  // stylesheet does not currently consume it, so we apply padding ourselves
  // via a wrapper element. We still forward `padding` to PageLayout.Sidebar
  // for forward-compatibility once the upstream styles consume it.
  return (
    <PageLayout.Sidebar
      position={position}
      sticky={sticky}
      padding={padding}
      divider={divider}
      hidden={hidden}
      aria-label={ariaLabel}
      {...props}
    >
      <div style={{padding: `var(--spacing-${padding})`}}>{children}</div>
    </PageLayout.Sidebar>
  )
}

Sidebar.displayName = 'FilteredListLayout.Sidebar'

// ----------------------------------------------------------------------------
// FilteredListLayout.Content
//
// Hosts the Results region. Thin wrapper around PageLayout.Content with
// FilteredListLayout's preferred defaults.

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
// Slot for filter input UI. v1 is a thin wrapper that applies a top margin
// so it sits visually below the heading row. Must be placed inside
// FilteredListLayout.Header.

export type FilteredListLayoutFilterBarProps = React.HTMLAttributes<HTMLDivElement>

export const FilterBar: React.FC<React.PropsWithChildren<FilteredListLayoutFilterBarProps>> = ({
  children,
  style,
  ...rest
}) => {
  return (
    <div style={{marginBlockStart: 'var(--stack-gap-condensed, 8px)', ...style}} {...rest}>
      {children}
    </div>
  )
}

FilterBar.displayName = 'FilteredListLayout.FilterBar'

// ----------------------------------------------------------------------------
// FilteredListLayout.Results
//
// Slot for the actual filtered results (issue list, PR list, etc). Lives
// inside FilteredListLayout.Content. Thin wrapper for v1 so we can hang
// spacing / virtualization conventions on it later without changing the
// consumer-facing API.

export type FilteredListLayoutResultsProps = {
  className?: string
  'aria-label'?: string
}

export const Results: React.FC<React.PropsWithChildren<FilteredListLayoutResultsProps>> = ({children, ...rest}) => {
  return <div {...rest}>{children}</div>
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
