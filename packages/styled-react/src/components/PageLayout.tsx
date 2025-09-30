import React, {type PropsWithChildren} from 'react'
import styled from 'styled-components'
import type {
  PageLayoutProps as PrimerPageLayoutProps,
  PageLayoutContentProps as PrimerPageLayoutContentProps,
  PageLayoutHeaderProps as PrimerPageLayoutHeaderProps,
  PageLayoutPaneProps as PrimerPageLayoutPaneProps,
  PageLayoutFooterProps as PrimerPageLayoutFooterProps,
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

type PageLayoutHeaderProps = PropsWithChildren<PrimerPageLayoutHeaderProps> & SxProp

const PageLayoutHeader = React.forwardRef<HTMLDivElement, PageLayoutHeaderProps>((props, ref) => {
  // @ts-expect-error - PrimerPageLayout.Header is not recognized as a valid component type
  return <Wrapper as={PrimerPageLayout.Header} ref={ref} {...props} />
})

type PageLayoutPaneProps = PropsWithChildren<PrimerPageLayoutPaneProps> & SxProp

const PageLayoutPane = React.forwardRef<HTMLDivElement, PageLayoutPaneProps>((props, ref) => {
  return <Wrapper as={PrimerPageLayout.Pane} ref={ref} {...props} />
})

type PageLayoutFooterProps = PropsWithChildren<PrimerPageLayoutFooterProps> & SxProp

const PageLayoutFooter = React.forwardRef<HTMLDivElement, PageLayoutFooterProps>((props, ref) => {
  // @ts-expect-error - PrimerPageLayout.Footer is not recognized as a valid component type
  return <Wrapper as={PrimerPageLayout.Footer} ref={ref} {...props} />
})

const PageLayout = Object.assign(PageLayoutImpl, {
  Content: PageLayoutContent,
  Header: PageLayoutHeader,
  Pane: PageLayoutPane,
  Footer: PageLayoutFooter,
})

export {PageLayout, type PageLayoutProps}
