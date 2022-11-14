import React from 'react'
import {Box} from '..'
import {useResponsiveValue, ResponsiveValue} from '../hooks/useResponsiveValue'
import {SxProp, merge, BetterSystemStyleObject} from '../sx'
import Heading from '../Heading'
import {IconButton} from '../Button'
import {ChevronLeftIcon} from '@primer/octicons-react'
import Link from '../Link'

/* Todos (will be deleted soon)

Reference figma - https://www.figma.com/file/Ee0OrXuOLXMDqUW83EnDHP/PageHeader-(FY23-Q1)?node-id=2%3A2259
- ContextArea should only be visible in narrow.
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
  ContextArea: 0,
  titleArea: 1,
  description: 2,
  localNav: 3
}

export type PageHeaderProps = {
  hidden?: boolean | ResponsiveValue<boolean>
} & SxProp

const Root: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  const rootStyles = {
    marginX: 'auto',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap'
  }
  return <Box sx={merge<BetterSystemStyleObject>(rootStyles, sx)}>{children}</Box>
}

// PageHeader.ContextArea : Only visible on narrow viewports to provide user context of where they are at their journey.
// PageHeader.ContexArea Sub Components: PageHeader.ParentLink, PageHeader.ContextBar, PageHeader.ContextNavActions
// ---------------------------------------------------------------------
export type ContextAreaProps = SxProp

const ContextArea: React.FC<React.PropsWithChildren<ContextAreaProps>> = ({children, sx = {}}) => {
  const isContextAreaHidden = {
    narrow: false,
    regular: true,
    wide: true
  }
  const isHidden = useResponsiveValue(isContextAreaHidden, false)
  const contentNavStyles = {
    display: isHidden ? 'none' : 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    order: REGION_ORDER.ContextArea,
    // want same behaviour as PageLayout
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 1 // Hack to prevent overflowing content from pushing the pane region to the next line
  }
  return <Box sx={merge<BetterSystemStyleObject>(contentNavStyles, sx)}>{children}</Box>
}

export type ParentLinkProps = {
  href?: string
} & SxProp

const ParentLink: React.FC<React.PropsWithChildren<ParentLinkProps>> = ({children, sx = {}, href}) => {
  return (
    <>
      <Link muted sx={merge<BetterSystemStyleObject>({display: 'flex', alignItems: 'center'}, sx)} href={href}>
        <ChevronLeftIcon />
        {children}
      </Link>
    </>
  )
}

// Generic slot for any component above the title region. Use it for custom breadcrumbs and other navigation elements instead of ParentLink.
const ContextBar: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  return <Box sx={sx}>{children}</Box>
}
const ContextAreaActions: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  return (
    <Box sx={merge<BetterSystemStyleObject>({display: 'flex', flexDirection: 'row', alignItems: 'center'}, sx)}>
      {children}
    </Box>
  )
}

// PageHeader.TitleArea: The main title area of the page. Visible on all viewports.
// PageHeader.TitleArea Sub Components: PageHeader.BackButton, PageHeader.LeadingVisual, PageHeader.Title, PageTitle.TrailingVisual, PageHeader.TrailingActions, PageHeader.Actions
// PageHeader.BackButton and PageHeader.TrailingAction are only visible on regular viewports therefore they come as hidden on narrow viewports and their visibility can be managed by their exposed `hidden` prop
// ---------------------------------------------------------------------
const TitleArea: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  return (
    <Box sx={merge<BetterSystemStyleObject>({display: 'flex', flexDirection: 'row', alignItems: 'center'}, sx)}>
      {children}
    </Box>
  )
}

export type BackButtonProps = {
  hidden?: boolean | ResponsiveValue<boolean>
} & SxProp
const BackButton: React.FC<React.PropsWithChildren<BackButtonProps>> = ({
  sx = {},
  hidden = {
    narrow: true,
    regular: false,
    wide: false
  }
}) => {
  // Default is hidden in narrow viewport but exposed as an API to allow consumers to override
  const isHidden = useResponsiveValue(hidden, true)
  return (
    <IconButton
      hidden={isHidden}
      sx={merge<BetterSystemStyleObject>(
        {
          display: isHidden ? 'none' : 'flex'
        },
        sx
      )}
      icon={ChevronLeftIcon}
      aria-label="Back"
      variant="invisible"
    />
  )
}
const LeadingVisual: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  return <Box sx={sx}>{children}</Box>
}

export type TitleProps = {
  variant?: 'subtitle' | 'medium' | 'large'
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}
const Title: React.FC<React.PropsWithChildren<PageHeaderProps & TitleProps>> = ({
  children,
  sx = {},
  variant = 'large',
  as = 'h1'
}) => {
  return (
    // Not sure about h1 - check with design and a11y
    <Heading
      as={as}
      sx={merge<BetterSystemStyleObject>(
        {
          fontSize: variant === 'large' ? 6 : variant === 'medium' ? 5 : 4
        },
        sx
      )}
    >
      {children}
    </Heading>
  )
}
const TrailingVisual: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  return <Box sx={sx}>{children}</Box>
}
const TrailingAction: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  return <Box sx={sx}>{children}</Box>
}

const Actions: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  return <Box sx={merge<BetterSystemStyleObject>({display: 'flex', flexDirection: 'row'}, sx)}>{children}</Box>
}
const Summary: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  return <Box sx={sx}>{children}</Box>
}

const LocalNav: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  return <Box sx={sx}>{children}</Box>
}

export const PageHeader = Object.assign(Root, {
  ContextArea,
  ParentLink,
  ContextBar,
  ContextAreaActions,
  TitleArea,
  BackButton,
  LeadingVisual,
  Title,
  TrailingVisual,
  TrailingAction,
  Actions,
  Summary,
  LocalNav
})
