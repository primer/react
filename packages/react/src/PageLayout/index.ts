import {PageLayout as PageLayoutImpl, Header, Content, Pane, Footer} from './PageLayout'
import type {
  PageLayoutProps,
  PageLayoutHeaderProps,
  PageLayoutFooterProps,
  PageLayoutContentProps,
  PageLayoutPaneProps,
} from './PageLayout'

PageLayoutImpl.displayName = 'PageLayout'
Header.displayName = 'PageLayout.Header'
Footer.displayName = 'PageLayout.Footer'
Content.displayName = 'PageLayout.Content'
Pane.displayName = 'PageLayout.Pane'

export const PageLayout = Object.assign(PageLayoutImpl, {
  Header,
  Content,
  Pane,
  Footer,
})

export type {PageLayoutProps, PageLayoutHeaderProps, PageLayoutFooterProps, PageLayoutContentProps, PageLayoutPaneProps}
