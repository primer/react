import type React from 'react'
import type {
  PageLayoutContentProps,
  PageLayoutFooterProps,
  PageLayoutHeaderProps,
  PageLayoutPaneProps,
  PageLayoutSidebarProps,
} from '../PageLayout'
import {PageLayout} from '../PageLayout'
import type {WithSlotMarker} from '../utils/types'

// ----------------------------------------------------------------------------
// SplitPageLayout

export type SplitPageLayoutProps = {className?: string}

export const Root: React.FC<React.PropsWithChildren<SplitPageLayoutProps>> = props => {
  return (
    <PageLayout
      data-component="SplitPageLayout"
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

Root.displayName = 'SplitPageLayout'

// ----------------------------------------------------------------------------
// SplitPageLayout.Header

export type SplitPageLayoutHeaderProps = PageLayoutHeaderProps

export const Header: React.FC<React.PropsWithChildren<SplitPageLayoutHeaderProps>> = ({
  padding = 'normal',
  divider = 'line',
  ...props
}) => {
  // eslint-disable-next-line primer-react/direct-slot-children
  return <PageLayout.Header data-component="SplitPageLayout.Header" padding={padding} divider={divider} {...props} />
}

Header.displayName = 'SplitPageLayout.Header'

// ----------------------------------------------------------------------------
// SplitPageLayout.Content

export type SplitPageLayoutContentProps = PageLayoutContentProps

export const Content: React.FC<React.PropsWithChildren<SplitPageLayoutContentProps>> = ({
  width = 'large',
  padding = 'normal',
  ...props
}) => {
  return <PageLayout.Content data-component="SplitPageLayout.Content" width={width} padding={padding} {...props} />
}

Content.displayName = 'SplitPageLayout.Content'

// ----------------------------------------------------------------------------
// SplitPageLayout.Pane

export type SplitPageLayoutPaneProps = PageLayoutPaneProps

export const Pane: React.FC<React.PropsWithChildren<SplitPageLayoutPaneProps>> = ({
  position = 'start',
  sticky = true,
  padding = 'normal',
  divider = 'line',
  ...props
}) => {
  return (
    <PageLayout.Pane
      data-component="SplitPageLayout.Pane"
      position={position}
      sticky={sticky}
      padding={padding}
      divider={divider}
      {...props}
    ></PageLayout.Pane>
  )
}
Pane.displayName = 'SplitPageLayout.Pane'

// ----------------------------------------------------------------------------
// SplitPageLayout.Sidebar

export type SplitPageLayoutSidebarProps = PageLayoutSidebarProps

export const Sidebar: React.FC<React.PropsWithChildren<SplitPageLayoutSidebarProps>> = ({
  position = 'start',
  padding = 'normal',
  divider = 'line',
  ...props
}) => {
  return (
    <PageLayout.Sidebar
      data-component="SplitPageLayout.Sidebar"
      position={position}
      padding={padding}
      divider={divider}
      {...props}
    />
  )
}

Sidebar.displayName = 'SplitPageLayout.Sidebar'

// ----------------------------------------------------------------------------
// SplitPageLayout.Footer

export type SplitPageLayoutFooterProps = PageLayoutFooterProps

export const Footer: React.FC<React.PropsWithChildren<SplitPageLayoutFooterProps>> = ({
  padding = 'normal',
  divider = 'line',
  ...props
}) => {
  // eslint-disable-next-line primer-react/direct-slot-children
  return <PageLayout.Footer data-component="SplitPageLayout.Footer" padding={padding} divider={divider} {...props} />
}

Footer.displayName = 'SplitPageLayout.Footer'

// ----------------------------------------------------------------------------
// Export
;(Header as WithSlotMarker<typeof Header>).__SLOT__ = PageLayout.Header.__SLOT__
;(Content as WithSlotMarker<typeof Content>).__SLOT__ = PageLayout.Content.__SLOT__
;(Pane as WithSlotMarker<typeof Pane>).__SLOT__ = PageLayout.Pane.__SLOT__
;(Sidebar as WithSlotMarker<typeof Sidebar>).__SLOT__ = PageLayout.Sidebar.__SLOT__
;(Footer as WithSlotMarker<typeof Footer>).__SLOT__ = PageLayout.Footer.__SLOT__

export const SplitPageLayout = Object.assign(Root, {
  Header,
  Content,
  Pane,
  Sidebar,
  Footer,
})
