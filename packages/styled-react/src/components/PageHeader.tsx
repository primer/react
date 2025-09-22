import {
  PageHeader as PrimerPageHeader,
  type PageHeaderProps as PrimerPageHeaderProps,
  type PageHeaderTitleProps as PrimerPageHeaderTitleProps,
  type PageHeaderActionsProps as PrimerPageHeaderActionsProps,
} from '@primer/react'
import styled from 'styled-components'
import {sx, type SxProp} from '../sx'
import type {ForwardRefComponent} from '../polymorphic'
import {Box} from './Box'

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

type PageHeaderTitleProps = PrimerPageHeaderTitleProps & SxProp

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

const PageHeader: typeof PageHeaderImpl & {
  ContextArea: typeof PrimerPageHeader.ContextArea
  ParentLink: typeof PrimerPageHeader.ParentLink
  ContextBar: typeof PrimerPageHeader.ContextBar
  TitleArea: typeof PrimerPageHeader.TitleArea
  ContextAreaActions: typeof PrimerPageHeader.ContextAreaActions
  LeadingAction: typeof PrimerPageHeader.LeadingAction
  Breadcrumbs: typeof PrimerPageHeader.Breadcrumbs
  LeadingVisual: typeof PrimerPageHeader.LeadingVisual
  Title: typeof PageHeaderTitle
  TrailingVisual: typeof PrimerPageHeader.TrailingVisual
  TrailingAction: typeof PrimerPageHeader.TrailingAction
  Actions: typeof PageHeaderActions
  Description: typeof PrimerPageHeader.Description
  Navigation: typeof PrimerPageHeader.Navigation
} = Object.assign(PageHeaderImpl, {
  ContextArea: PrimerPageHeader.ContextArea,
  ParentLink: PrimerPageHeader.ParentLink,
  ContextBar: PrimerPageHeader.ContextBar,
  TitleArea: PrimerPageHeader.TitleArea,
  ContextAreaActions: PrimerPageHeader.ContextAreaActions,
  LeadingAction: PrimerPageHeader.LeadingAction,
  Breadcrumbs: PrimerPageHeader.Breadcrumbs,
  LeadingVisual: PrimerPageHeader.LeadingVisual,
  Title: PageHeaderTitle,
  TrailingVisual: PrimerPageHeader.TrailingVisual,
  TrailingAction: PrimerPageHeader.TrailingAction,
  Actions: PageHeaderActions,
  Description: PrimerPageHeader.Description,
  Navigation: PrimerPageHeader.Navigation,
})

export {PageHeader}
export type {PageHeaderProps, PageHeaderActionsProps, PageHeaderTitleProps}
