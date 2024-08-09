import {Root as PageLayoutImpl, Header, Content, Pane, Footer} from './PageLayout'
import type {
  PageLayoutProps,
  PageLayoutHeaderProps,
  PageLayoutFooterProps,
  PageLayoutContentProps,
  PageLayoutPaneProps,
} from './PageLayout'

export const PageLayout = Object.assign(PageLayoutImpl, {
  Header,
  Content,
  Pane,
  Footer,
})

export type {PageLayoutProps, PageLayoutHeaderProps, PageLayoutFooterProps, PageLayoutContentProps, PageLayoutPaneProps}
