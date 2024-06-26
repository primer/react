import React from 'react'
import type {FC, PropsWithChildren} from 'react'
import type {SxProp} from '..'
import type {
  PageLayoutContentProps,
  PageLayoutFooterProps,
  PageLayoutHeaderProps,
  PageLayoutPaneProps,
} from '../PageLayout'
import {PageLayout} from '../PageLayout'

// ----------------------------------------------------------------------------
// SplitPageLayout

export type SplitPageLayoutProps = SxProp

/**
 * Split page layout is an abstraction for using the PageLayout component to provide structure for a split layout.
 * @primerid split_page_layout
 * @primerstatus alpha
 * @primera11yreviewed true
 */
export const Root: FC<PropsWithChildren<SplitPageLayoutProps>> = props => {
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

Root.displayName = 'SplitPageLayout'

// ----------------------------------------------------------------------------
// SplitPageLayout.Header

export type SplitPageLayoutHeaderProps = PageLayoutHeaderProps

/**
 * The header area of the overall page layout.
 * @alias SplitPageLayout.Header
 * @primerparentid split_page_layout
 */
export const Header: FC<PropsWithChildren<SplitPageLayoutHeaderProps>> = ({
  padding = 'normal',
  divider = 'line',
  ...props
}) => {
  // eslint-disable-next-line primer-react/direct-slot-children
  return <PageLayout.Header padding={padding} divider={divider} {...props} />
}

Header.displayName = 'SplitPageLayout.Header'

// ----------------------------------------------------------------------------
// SplitPageLayout.Content

export type SplitPageLayoutContentProps = PageLayoutContentProps

/**
 * The main content area.
 * @alias SplitPageLayout.Content
 * @primerparentid split_page_layout
 */
export const Content: FC<PropsWithChildren<SplitPageLayoutContentProps>> = ({
  width = 'large',
  padding = 'normal',
  ...props
}) => {
  return <PageLayout.Content width={width} padding={padding} {...props} />
}

Content.displayName = 'SplitPageLayout.Content'

// ----------------------------------------------------------------------------
// SplitPageLayout.Pane

export type SplitPageLayoutPaneProps = PageLayoutPaneProps
/**
 * By default, it is a sidebar that sticks on the left used for navigating to update the main content area.
 * @alias SplitPageLayout.Pane
 * @primerparentid split_page_layout
 */
export const Pane: FC<PropsWithChildren<SplitPageLayoutPaneProps>> = ({
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
    ></PageLayout.Pane>
  )
}
Pane.displayName = 'SplitPageLayout.Pane'

// ----------------------------------------------------------------------------
// SplitPageLayout.Footer

export type SplitPageLayoutFooterProps = PageLayoutFooterProps

/**
 * The footer area of the overall page layout.
 * @alias SplitPageLayout.Footer
 * @primerparentid split_page_layout
 */
export const Footer: FC<PropsWithChildren<SplitPageLayoutFooterProps>> = ({
  padding = 'normal',
  divider = 'line',
  ...props
}) => {
  // eslint-disable-next-line primer-react/direct-slot-children
  return <PageLayout.Footer padding={padding} divider={divider} {...props} />
}

Footer.displayName = 'SplitPageLayout.Footer'

// ----------------------------------------------------------------------------
// Export

export const SplitPageLayout = Object.assign(Root, {
  Header,
  Content,
  Pane,
  Footer,
})
