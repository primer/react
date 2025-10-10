import React, {type PropsWithChildren} from 'react'
import styled from 'styled-components'
import type {
  PageLayoutProps as PrimerPageLayoutProps,
  PageLayoutContentProps as PrimerPageLayoutContentProps,
  PageLayoutPaneProps as PrimerPageLayoutPaneProps,
} from '@primer/react'
import {PageLayout as PrimerPageLayout} from '@primer/react'
import {sx, type SxProp} from '../sx'

const Wrapper = styled.div<SxProp>`
  ${sx}
`

type PageLayoutProps = PropsWithChildren<PrimerPageLayoutProps> & SxProp

const PageLayoutImpl = React.forwardRef<HTMLDivElement, PageLayoutProps>((props, ref) => {
  // @ts-expect-error - PrimerPageLayout is not recognized as a valid component type
  return <Wrapper as={PrimerPageLayout} ref={ref} {...props} />
})

type PageLayoutContentProps = PropsWithChildren<PrimerPageLayoutContentProps> & SxProp

const PageLayoutContent = React.forwardRef<HTMLDivElement, PageLayoutContentProps>((props, ref) => {
  return <Wrapper as={PrimerPageLayout.Content} ref={ref} {...props} />
})

type PageLayoutPaneProps = PropsWithChildren<PrimerPageLayoutPaneProps> & SxProp

const PageLayoutPane = React.forwardRef<HTMLDivElement, PageLayoutPaneProps>((props, ref) => {
  return <Wrapper as={PrimerPageLayout.Pane} ref={ref} {...props} />
})

const PageLayout = Object.assign(PageLayoutImpl, {
  Content: PageLayoutContent,
  Header: PrimerPageLayout.Header,
  Pane: PageLayoutPane,
  Footer: PrimerPageLayout.Footer,
})

// @ts-ignore -- TS doesn't know about the __SLOT__ property
PageLayoutImpl.__SLOT__ = PrimerPageLayout.__SLOT__
// @ts-ignore -- TS doesn't know about the __SLOT__ property
PageLayoutContent.__SLOT__ = PrimerPageLayout.Content.__SLOT__
// @ts-ignore -- TS doesn't know about the __SLOT__ property
PageLayoutPane.__SLOT__ = PrimerPageLayout.Pane.__SLOT__

export {PageLayout, type PageLayoutProps}
