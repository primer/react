import {
  PageHeader as PrimerPageHeader,
  type PageHeaderProps as PrimerPageHeaderProps,
  type PageHeaderTitleProps as PrimerPageHeaderTitleProps,
  type PageHeaderActionsProps as PrimerPageHeaderActionsProps,
  type PageHeaderTitleAreaProps as PrimerPageHeaderTitleAreaProps,
} from '@primer/react'
import styled from 'styled-components'
import {sx, type SxProp} from '../sx'
import type {ForwardRefComponent} from '../polymorphic'
import {Box} from './Box'
import type {PropsWithChildren} from 'react'

type PageHeaderProps = PrimerPageHeaderProps & SxProp

const PageHeaderImpl: ForwardRefComponent<'div', PageHeaderProps> = styled(
  PrimerPageHeader,
).withConfig<PageHeaderProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

type PageHeaderActionsProps = PrimerPageHeaderActionsProps & SxProp

function PageHeaderActions({sx, ...rest}: PageHeaderActionsProps) {
  const style: CSSCustomProperties = {}
  if (sx) {
    // @ts-ignore sx has height attribute
    const {height} = sx
    if (height) {
      style['--custom-height'] = height
    }
  }

  // @ts-expect-error type mismatch between Box usage here and PrimerPageHeader.Actions
  return <Box {...rest} as={PrimerPageHeader.Actions} style={style} sx={sx} />
}

type PageHeaderTitleProps = PropsWithChildren<PrimerPageHeaderTitleProps> & SxProp

type CSSCustomProperties = {
  [key: `--${string}`]: string | number
}

function PageHeaderTitle({sx, ...rest}: PageHeaderTitleProps) {
  const style: CSSCustomProperties = {}
  if (sx) {
    // @ts-ignore sx can have color attribute
    const {fontSize, lineHeight, fontWeight} = sx
    if (fontSize) {
      style['--custom-font-size'] = fontSize
    }

    if (lineHeight) {
      style['--custom-line-height'] = lineHeight
    }

    if (fontWeight) {
      style['--custom-font-weight'] = fontWeight
    }
  }

  // @ts-expect-error type mismatch between Box usage here and PrimerPageHeader.Title
  return <Box {...rest} as={PrimerPageHeader.Title} style={style} sx={sx} />
}

type PageHeaderTitleAreaProps = PropsWithChildren<PrimerPageHeaderTitleAreaProps> & SxProp

const PageHeaderTitleArea: ForwardRefComponent<'div', PageHeaderTitleAreaProps> = styled(
  PrimerPageHeader.TitleArea,
).withConfig<PageHeaderTitleAreaProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

const PageHeader = Object.assign(PageHeaderImpl, {
  Actions: PageHeaderActions,
  Title: PageHeaderTitle,
  TitleArea: PageHeaderTitleArea,
  ContextArea: PrimerPageHeader.ContextArea,
  ContextAreaActions: PrimerPageHeader.ContextAreaActions,
  TrailingVisual: PrimerPageHeader.TrailingVisual,
  Description: PrimerPageHeader.Description,
  ContextBar: PrimerPageHeader.ContextBar,
  LeadingAction: PrimerPageHeader.LeadingAction,
  Breadcrumbs: PrimerPageHeader.Breadcrumbs,
  LeadingVisual: PrimerPageHeader.LeadingVisual,
  TrailingAction: PrimerPageHeader.TrailingAction,
})

export {PageHeader}
export type {PageHeaderProps, PageHeaderActionsProps, PageHeaderTitleProps}
