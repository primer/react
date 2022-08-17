import React from 'react'
import {SxProp} from '..'
import {
  PageLayout,
  PageLayoutContentProps,
  PageLayoutFooterProps,
  PageLayoutHeaderProps,
  PageLayoutPaneProps
} from '../PageLayout'

// ----------------------------------------------------------------------------
// SplitPageLayout

export type SplitPageLayoutProps = SxProp

export const Root: React.FC<React.PropsWithChildren<SplitPageLayoutProps>> = props => {
  return <PageLayout containerWidth="full" padding="none" columnGap="none" rowGap="none" {...props} />
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
  return <PageLayout.Header padding={padding} divider={divider} {...props} />
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
  return <PageLayout.Content width={width} padding={padding} {...props} />
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
  return <PageLayout.Pane position={position} sticky={sticky} padding={padding} divider={divider} {...props} />
}
Pane.displayName = 'SplitPageLayout.Pane'

// ----------------------------------------------------------------------------
// SplitPageLayout.Footer

export type SplitPageLayoutFooterProps = PageLayoutFooterProps

export const Footer: React.FC<React.PropsWithChildren<SplitPageLayoutFooterProps>> = ({
  padding = 'normal',
  divider = 'line',
  ...props
}) => {
  return <PageLayout.Footer padding={padding} divider={divider} {...props} />
}

Footer.displayName = 'SplitPageLayout.Footer'

// ----------------------------------------------------------------------------
// Export

export const SplitPageLayout = Object.assign(Root, {
  Header,
  Content,
  Pane,
  Footer
})
