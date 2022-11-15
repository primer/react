import React from 'react'
import {Box} from '..'
import {useResponsiveValue, ResponsiveValue} from '../hooks/useResponsiveValue'
import {SxProp, merge, BetterSystemStyleObject} from '../sx'
import Heading from '../Heading'
import {IconButton} from '../Button'
import {ArrowLeftIcon, ChevronLeftIcon} from '@primer/octicons-react'
import Link from '../Link'

/* Todos (will be deleted soon)

Reference figma - https://www.figma.com/file/Ee0OrXuOLXMDqUW83EnDHP/PageHeader-(FY23-Q1)?node-id=2%3A2259
- Header rows should not wrap ever. be small?
- Button size for content actions must icon. Should have href.
- grid or flex? regions or areas?
- Backbutton, TrailingAction only on regular viewport
- Start writing some docs.
- I don't think I need a context. There's no dependencies between rows.
*/

const REGION_ORDER = {
  ContextArea: 0,
  titleArea: 1,
  description: 2,
  Navigation: 3
}
// Root
// -----------------------------------------------------------------------------
export type PageHeaderProps = {
  hidden?: boolean | ResponsiveValue<boolean>
} & SxProp

const Root: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  const rootStyles = {
    marginX: 'auto',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 1
  }
  return <Box sx={merge<BetterSystemStyleObject>(rootStyles, sx)}>{children}</Box>
}

// PageHeader.ContextArea : Only visible on narrow viewports by default to provide user context of where they are at their journey. `hidden` prop available
// to manage their custom visibility but consumers should be careful to hide this on narrow viewports.
// PageHeader.ContexArea Sub Components: PageHeader.ParentLink, PageHeader.ContextBar, PageHeader.ContextNavActions
// ---------------------------------------------------------------------
export type ContextAreaProps = {
  hidden?: boolean | ResponsiveValue<boolean>
} & SxProp

const ContextArea: React.FC<React.PropsWithChildren<ContextAreaProps>> = ({
  children,
  hidden = {
    narrow: false,
    regular: true,
    wide: true
  },
  sx = {}
}) => {
  const isHidden = useResponsiveValue(hidden, false)
  const contentNavStyles = {
    display: isHidden ? 'none' : 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '8px',
    order: REGION_ORDER.ContextArea
  }
  return (
    <Box hidden={isHidden} sx={merge<BetterSystemStyleObject>(contentNavStyles, sx)}>
      {children}
    </Box>
  )
}

export type ParentLinkProps = {
  href?: string
  hidden?: boolean | ResponsiveValue<boolean>
} & SxProp

const ParentLink: React.FC<React.PropsWithChildren<ParentLinkProps>> = ({
  children,
  sx = {},
  href,
  hidden = {
    narrow: false,
    regular: true,
    wide: true
  }
}) => {
  const isHidden = useResponsiveValue(hidden, false)
  return (
    <>
      <Link
        hidden={isHidden}
        muted
        sx={merge<BetterSystemStyleObject>({display: 'flex', alignItems: 'center'}, sx)}
        href={href}
      >
        <ArrowLeftIcon />
        <Box sx={{marginLeft: 2}}>{children}</Box>
      </Link>
    </>
  )
}

// ContextBar
// Generic slot for any component above the title region. Use it for custom breadcrumbs and other navigation elements instead of ParentLink.
// ---------------------------------------------------------------------

export type ContextBarProps = {
  hidden?: boolean | ResponsiveValue<boolean>
} & SxProp

const ContextBar: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({
  children,
  sx = {},
  hidden = {
    narrow: false,
    regular: true,
    wide: true
  }
}) => {
  const isHidden = useResponsiveValue(hidden, false)
  return (
    <Box hidden={isHidden} sx={sx}>
      {children}
    </Box>
  )
}

// ContextAreaActions
// ---------------------------------------------------------------------
export type ContextAreaActionsProps = {
  hidden?: boolean | ResponsiveValue<boolean>
} & SxProp
const ContextAreaActions: React.FC<React.PropsWithChildren<ContextAreaActionsProps>> = ({
  children,
  sx = {},
  hidden = {
    narrow: false,
    regular: true,
    wide: true
  }
}) => {
  const isHidden = useResponsiveValue(hidden, false)
  return (
    <Box
      hidden={isHidden}
      sx={merge<BetterSystemStyleObject>(
        {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '8px',
          flexGrow: '1',
          justifyContent: 'right'
        },
        sx
      )}
    >
      {children}
    </Box>
  )
}

// PageHeader.TitleArea: The main title area of the page. Visible on all viewports.
// PageHeader.TitleArea Sub Components: PageHeader.BackButton, PageHeader.LeadingVisual, PageHeader.Title, PageTitle.TrailingVisual, PageHeader.TrailingActions, PageHeader.Actions
// PageHeader.BackButton and PageHeader.TrailingAction are only visible on regular viewports therefore they come as hidden on narrow viewports and their visibility can be managed by their exposed `hidden` prop
// ---------------------------------------------------------------------
const TitleArea: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  console.log({children})
  return (
    <Box
      sx={merge<BetterSystemStyleObject>({display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px'}, sx)}
    >
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
  variant?: 'subtitle' | 'medium' | 'large' | ResponsiveValue<'subtitle' | 'medium' | 'large'>
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}
const Title: React.FC<React.PropsWithChildren<PageHeaderProps & TitleProps>> = ({
  children,
  sx = {},
  variant = {
    narrow: 'medium',
    regular: 'large',
    wide: 'large'
  },
  as = 'h1'
}) => {
  const currentVariant = useResponsiveValue(variant, 'medium')
  return (
    // Not sure about h1 - check with design and a11y
    // TODO: use primitives for font styles
    <Heading
      as={as}
      sx={merge<BetterSystemStyleObject>(
        {
          fontSize: {
            large: '32px',
            medium: '20px',
            subtitle: '20px'
          }[currentVariant],
          lineHeight: {
            large: '48px',
            medium: '32px',
            subtitle: '32px'
          }[currentVariant],
          fontWeight: {
            large: '600',
            medium: '600',
            subtitle: '400'
          }[currentVariant]
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

export type TrailingActionsProps = {
  hidden?: boolean | ResponsiveValue<boolean>
} & SxProp

const TrailingAction: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({
  children,
  sx = {},
  hidden = {
    narrow: true,
    regular: false,
    wide: false
  }
}) => {
  const isHidden = useResponsiveValue(hidden, true)
  return (
    <Box hidden={isHidden} sx={sx}>
      {children}
    </Box>
  )
}

const Actions: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  return (
    <Box
      sx={merge<BetterSystemStyleObject>(
        {display: 'flex', flexDirection: 'row', gap: '8px', flexGrow: '1', justifyContent: 'right'},
        sx
      )}
    >
      {children}
    </Box>
  )
}
const Description: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  return (
    <Box
      sx={merge<BetterSystemStyleObject>(
        {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '8px'
        },
        sx
      )}
    >
      {children}
    </Box>
  )
}

const Navigation: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
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
  Description,
  Navigation
})
