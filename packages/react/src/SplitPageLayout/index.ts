import {Root as SplitPageLayoutImpl, Header, Content, Pane, Footer} from './SplitPageLayout'
import type {
  SplitPageLayoutProps,
  SplitPageLayoutHeaderProps,
  SplitPageLayoutFooterProps,
  SplitPageLayoutContentProps,
  SplitPageLayoutPaneProps,
} from './SplitPageLayout'

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
