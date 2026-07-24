import React from 'react'
import {cn} from '../../internal/cn'
import {
  PageLayout,
  type PageLayoutContentProps,
  type PageLayoutFooterProps,
  type PageLayoutHeaderProps,
  type PageLayoutPaneProps,
  type PageLayoutProps,
  type PageLayoutSidebarProps,
} from '../PageLayout/PageLayout'
import {PageLayoutMarkerContext} from '../PageLayout/markers'

export type SplitPageLayoutProps = PageLayoutProps
const splitPageLayoutMarkers = {
  root: 'SplitPageLayout',
  header: 'SplitPageLayout.Header',
  content: 'SplitPageLayout.Content',
  pane: 'SplitPageLayout.Pane',
  sidebar: 'SplitPageLayout.Sidebar',
  footer: 'SplitPageLayout.Footer',
}
const Root = React.forwardRef<HTMLDivElement, SplitPageLayoutProps>(function SplitPageLayout(
  {className, columnGap = 'none', containerWidth = 'full', padding = 'none', rowGap = 'none', ...rest},
  ref,
) {
  return (
    <PageLayoutMarkerContext.Provider value={splitPageLayoutMarkers}>
      <PageLayout
        {...rest}
        ref={ref}
        containerWidth={containerWidth}
        padding={padding}
        rowGap={rowGap}
        columnGap={columnGap}
        className={cn(className)}
        data-layout="split"
      />
    </PageLayoutMarkerContext.Provider>
  )
})

const Header = React.forwardRef<HTMLElement, PageLayoutHeaderProps>(function SplitPageLayoutHeader(
  {divider = 'line', padding = 'normal', ...rest},
  ref,
) {
  // eslint-disable-next-line primer-react/direct-slot-children -- This config component composes the presentational part.
  return <PageLayout.Header {...rest} ref={ref} divider={divider} padding={padding} />
})
export type SplitPageLayoutHeaderProps = PageLayoutHeaderProps
const Content = React.forwardRef<HTMLElement, PageLayoutContentProps>(function SplitPageLayoutContent(
  {padding = 'normal', width = 'large', ...rest},
  ref,
) {
  return <PageLayout.Content {...rest} ref={ref} padding={padding} width={width} />
})
export type SplitPageLayoutContentProps = PageLayoutContentProps
const Pane = React.forwardRef<HTMLElement, PageLayoutPaneProps>(function SplitPageLayoutPane(
  {divider = 'line', padding = 'normal', position = 'start', sticky = true, ...rest},
  ref,
) {
  return <PageLayout.Pane {...rest} ref={ref} divider={divider} padding={padding} position={position} sticky={sticky} />
})
export type SplitPageLayoutPaneProps = PageLayoutPaneProps
const Sidebar = React.forwardRef<HTMLDivElement, PageLayoutSidebarProps>(function SplitPageLayoutSidebar(
  {divider = 'line', padding = 'normal', position = 'start', ...rest},
  ref,
) {
  return <PageLayout.Sidebar {...rest} ref={ref} divider={divider} padding={padding} position={position} />
})
export type SplitPageLayoutSidebarProps = PageLayoutSidebarProps
const Footer = React.forwardRef<HTMLElement, PageLayoutFooterProps>(function SplitPageLayoutFooter(
  {divider = 'line', padding = 'normal', ...rest},
  ref,
) {
  // eslint-disable-next-line primer-react/direct-slot-children -- This config component composes the presentational part.
  return <PageLayout.Footer {...rest} ref={ref} divider={divider} padding={padding} />
})
export type SplitPageLayoutFooterProps = PageLayoutFooterProps

Root.displayName = 'SplitPageLayout'
export const SplitPageLayout = Object.assign(Root, {Header, Content, Pane, Sidebar, Footer})
