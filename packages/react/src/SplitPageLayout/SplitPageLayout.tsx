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
