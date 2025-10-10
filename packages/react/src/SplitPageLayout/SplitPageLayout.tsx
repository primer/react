import type React from 'react'
import type {
  PageLayoutContentProps,
  PageLayoutFooterProps,
  PageLayoutHeaderProps,
  PageLayoutPaneProps,
} from '../PageLayout'
import {PageLayout} from '../PageLayout'

// ----------------------------------------------------------------------------
// SplitPageLayout

export type SplitPageLayoutProps = {className?: string}

export const Root: React.FC<React.PropsWithChildren<SplitPageLayoutProps>> = props => {
  return (
    <PageLayout
      containerWidth="full"
      padding="none"
      columnGap="none"
      rowGap="none"
      _slotsConfig={{
        header: {type: Header},
        footer: {type: Footer},
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

export const Footer: React.FC<React.PropsWithChildren<SplitPageLayoutFooterProps>> = ({
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
