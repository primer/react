import {SplitPageLayout as SplitPageLayoutImpl, Header, Content, Pane, Footer} from './SplitPageLayout'
import type {
  SplitPageLayoutProps,
  SplitPageLayoutHeaderProps,
  SplitPageLayoutFooterProps,
  SplitPageLayoutContentProps,
  SplitPageLayoutPaneProps,
} from './SplitPageLayout'

SplitPageLayoutImpl.displayName = 'SplitPageLayout'
Header.displayName = 'SplitPageLayout.Header'
Content.displayName = 'SplitPageLayout.Content'
Pane.displayName = 'SplitPageLayout.Pane'
Footer.displayName = 'SplitPageLayout.Footer'

export const SplitPageLayout = Object.assign(SplitPageLayoutImpl, {
  Header,
  Content,
  Pane,
  Footer,
})

export type {
  SplitPageLayoutProps,
  SplitPageLayoutHeaderProps,
  SplitPageLayoutFooterProps,
  SplitPageLayoutContentProps,
  SplitPageLayoutPaneProps,
}
