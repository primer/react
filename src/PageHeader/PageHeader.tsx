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
  TitleArea: 1,
  Description: 2,
  Navigation: 3
}

// Types that are shared between sub components
export type sharedPropTypes = {
  hidden?: boolean | ResponsiveValue<boolean>
} & SxProp

// Default state for the `hidden` prop when a sub component is only visible on narrow viewport
const onlyVisibleOnNarrowView = {
  narrow: false,
  regular: true,
  wide: true
}

// Root
// -----------------------------------------------------------------------------
export type PageHeaderProps = sharedPropTypes

const Root: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  const rootStyles = {
    display: 'flex',
    flexDirection: 'column'
    // flexWrap: 'wrap'
  }
  return <Box sx={merge<BetterSystemStyleObject>(rootStyles, sx)}>{children}</Box>
}

// PageHeader.ContextArea : Only visible on narrow viewports by default to provide user context of where they are at their journey. `hidden` prop available
// to manage their custom visibility but consumers should be careful to hide this on narrow viewports.
// PageHeader.ContexArea Sub Components: PageHeader.ParentLink, PageHeader.ContextBar, PageHeader.ContextNavActions
// ---------------------------------------------------------------------

const ContextArea: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({
  children,
  hidden = onlyVisibleOnNarrowView,
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
} & PageHeaderProps

const ParentLink: React.FC<React.PropsWithChildren<ParentLinkProps>> = ({
  children,
  sx = {},
  href,
  hidden = onlyVisibleOnNarrowView
}) => {
  const isHidden = useResponsiveValue(hidden, false)
  // console.log('is hidden', isHidden)
  return (
    <>
      <Link
        muted
        sx={merge<BetterSystemStyleObject>({display: isHidden ? ' none' : 'flex', alignItems: 'center'}, sx)}
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

const ContextBar: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({
  children,
  sx = {},
  hidden = onlyVisibleOnNarrowView
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
const ContextAreaActions: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({
  children,
  sx = {},
  hidden = onlyVisibleOnNarrowView
}) => {
  const isHidden = useResponsiveValue(hidden, false)
  console.log({hidden}, {isHidden})
  return (
    <Box
      hidden={isHidden}
      sx={merge<BetterSystemStyleObject>(
        {
          display: isHidden ? 'none' : 'flex',
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
  return (
    <Box
      sx={merge<BetterSystemStyleObject>({display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px'}, sx)}
    >
      {children}
    </Box>
  )
}

const BackButton: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({
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
const LeadingVisual: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({
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
      sx={merge<BetterSystemStyleObject>(
        {
          display: isHidden ? 'none' : 'flex'
        },
        sx
      )}
    >
      {children}
    </Box>
  )
}

export type TitleProps = {
  variant?: 'subtitle' | 'medium' | 'large' | ResponsiveValue<'subtitle' | 'medium' | 'large'>
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
} & PageHeaderProps

const Title: React.FC<React.PropsWithChildren<TitleProps>> = ({
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
const TrailingVisual: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({
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
      sx={merge<BetterSystemStyleObject>(
        {
          display: isHidden ? 'none' : 'flex'
        },
        sx
      )}
    >
      {children}
    </Box>
  )
}

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

const Actions: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}, hidden = false}) => {
  const isHidden = useResponsiveValue(hidden, false)
  return (
    <Box
      sx={merge<BetterSystemStyleObject>(
        {display: isHidden ? 'none' : 'flex', flexDirection: 'row', gap: '8px', flexGrow: '1', justifyContent: 'right'},
        sx
      )}
    >
      {children}
    </Box>
  )
}

// PageHeader.Description: The description area of the header. Visible on all viewports
const Description: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}, hidden = false}) => {
  const isHidden = useResponsiveValue(hidden, false)
  return (
    <Box
      sx={merge<BetterSystemStyleObject>(
        {
          display: isHidden ? 'none' : 'flex',
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

// PageHeader.Navigation: The local navigation area of the header. Visible on all viewports
const Navigation: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}, hidden = false}) => {
  const isHidden = useResponsiveValue(hidden, false)
  return (
    <Box
      sx={merge<BetterSystemStyleObject>(
        {
          display: isHidden ? 'none' : 'block'
        },
        sx
      )}
    >
      {children}
    </Box>
  )
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
