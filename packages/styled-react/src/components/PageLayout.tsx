import React, {type PropsWithChildren} from 'react'
import styled from 'styled-components'
import type {
  PageLayoutProps as PrimerPageLayoutProps,
  PageLayoutContentProps as PrimerPageLayoutContentProps,
  PageLayoutPaneProps as PrimerPageLayoutPaneProps,
  SlotMarker,
} from '@primer/react'
import {PageLayout as PrimerPageLayout} from '@primer/react'
import {sx, type SxProp} from '../sx'

const Wrapper = styled.div<SxProp>`
  ${sx}
`

type PageLayoutProps = PropsWithChildren<PrimerPageLayoutProps> & SxProp

const PageLayoutImpl = React.forwardRef<HTMLDivElement, PageLayoutProps>((props, ref) => {
  // @ts-expect-error - PrimerPageLayout is not recognized as a valid component type
  // eslint-disable-next-line primer-react/spread-props-first -- `as` must come before spread for styled-components type inference
  return <Wrapper as={PrimerPageLayout} ref={ref} {...props} />
})

type PageLayoutContentProps = PropsWithChildren<PrimerPageLayoutContentProps> & SxProp

const PageLayoutContent = React.forwardRef<HTMLDivElement, PageLayoutContentProps>((props, ref) => {
  // eslint-disable-next-line primer-react/spread-props-first -- `as` must come before spread for styled-components type inference
  return <Wrapper as={PrimerPageLayout.Content} ref={ref} {...props} />
})

type PageLayoutPaneProps = PropsWithChildren<PrimerPageLayoutPaneProps> & SxProp

const PageLayoutPane = React.forwardRef<HTMLDivElement, PageLayoutPaneProps>((props, ref) => {
  // eslint-disable-next-line primer-react/spread-props-first -- `as` must come before spread for styled-components type inference
  return <Wrapper as={PrimerPageLayout.Pane} ref={ref} {...props} />
})

type PageLayoutType = typeof PageLayoutImpl & {
  Content: typeof PageLayoutContent
  Header: typeof PrimerPageLayout.Header
  Pane: typeof PageLayoutPane
  Footer: typeof PrimerPageLayout.Footer
}

const PageLayout: PageLayoutType = Object.assign(PageLayoutImpl, {
  __SLOT__: PrimerPageLayout.__SLOT__,
  Content: PageLayoutContent,
  Header: PrimerPageLayout.Header,
  Pane: PageLayoutPane,
  Footer: PrimerPageLayout.Footer,
})

;(PageLayoutContent as typeof PageLayoutContent & SlotMarker).__SLOT__ = PrimerPageLayout.Content.__SLOT__
;(PageLayoutPane as typeof PageLayoutPane & SlotMarker).__SLOT__ = PrimerPageLayout.Pane.__SLOT__

export {PageLayout, type PageLayoutProps}
