import React from 'react'
import {Box} from '..'
import {useResponsiveValue, ResponsiveValue} from '../hooks/useResponsiveValue'
import {SxProp, merge, BetterSystemStyleObject} from '../sx'

/* Todos (will be deleted soon)

Reference figma - https://www.figma.com/file/Ee0OrXuOLXMDqUW83EnDHP/PageHeader-(FY23-Q1)?node-id=2%3A2259
- ContextNav should only be visible in narrow.
- Header rows should not wrap ever. be small?
- ParentTitle should have a back arrow
- Actions should all align right
- Button size for content actions must icon. Should have href.
- grid or flex? regions or areas?
- Backbutton, TrailingAction only on regular viewport
- Start writing some docs.
- Use 3 dots icon
- I don't think I need a context. There's no dependencies between rows.
- Example with localnav and underlinenav?
*/

const REGION_ORDER = {
  contextNav: 0,
  titleArea: 1,
  description: 2,
  localNav: 3
}

export type PageHeaderProps = SxProp

const Root: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  const rootStyles = {
    marginX: 'auto',
    display: 'flex',
    flexWrap: 'wrap'
  }
  return <Box sx={merge<BetterSystemStyleObject>(rootStyles, sx)}>{children}</Box>
}

export type ContextNavProps = {
  hidden?: boolean | ResponsiveValue<boolean>
} & SxProp

const ContextNav: React.FC<React.PropsWithChildren<ContextNavProps>> = ({
  children,
  sx = {},
  hidden = {
    narrow: false,
    regular: true,
    wide: true
  }
}) => {
  const isHidden = useResponsiveValue(hidden, false)
  const contentNavStyles = {
    display: isHidden ? 'none' : 'flex',
    flexDirection: 'column',
    order: REGION_ORDER.contextNav,
    // want same behaviour as PageLayout
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 1 // Hack to prevent overflowing content from pushing the pane region to the next line
  }
  return <Box sx={merge(contentNavStyles, sx)}>{children}</Box>
}
const ParentLink: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  return <Box sx={sx}>{children}</Box>
}
const ContextNavActions: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  return <Box sx={sx}>{children}</Box>
}
const TitleArea: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  return <Box sx={sx}>{children}</Box>
}
const LeadingVisual: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  return <Box sx={sx}>{children}</Box>
}
const TrailingVisual: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  return <Box sx={sx}>{children}</Box>
}
const TrailingAction: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  return <Box sx={sx}>{children}</Box>
}
const BackButton: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  return <Box sx={sx}>{children}</Box>
}
const Actions: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  return <Box sx={sx}>{children}</Box>
}
const Summary: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  return <Box sx={sx}>{children}</Box>
}

const LocalNav: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  return <Box sx={sx}>{children}</Box>
}

export const PageHeader = Object.assign(Root, {
  ContextNav,
  ParentLink,
  ContextNavActions,
  TitleArea,
  LeadingVisual,
  TrailingVisual,
  TrailingAction,
  BackButton,
  Actions,
  Summary,
  LocalNav
})
