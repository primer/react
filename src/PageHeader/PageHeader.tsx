import React from 'react'
import {Box} from '..'
import {useResponsiveValue, ResponsiveValue} from '../hooks/useResponsiveValue'
import {SxProp, merge, BetterSystemStyleObject} from '../sx'
import Heading from '../Heading'
import {ArrowLeftIcon} from '@primer/octicons-react'
import Link from '../Link'

const REGION_ORDER = {
  ContextArea: 0,
  TitleArea: 1,
  Description: 2,
  Navigation: 3
}

// Types that are shared between sub components
export type sharedPropTypes = {
  visible?: boolean | ResponsiveValue<boolean>
} & SxProp

// Default state for the `visible` prop when a sub component is only visible on narrow viewport
const onlyVisibleOnNarrowView = {
  narrow: true,
  regular: false,
  wide: false
}

const visibleOnRegularView = {
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
    flexDirection: 'column',
    gap: '8px',
    padding: useResponsiveValue(
      {
        narrow: 3,
        regular: 4,
        wide: 4
      },
      false
    )
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
  visible = onlyVisibleOnNarrowView,
  sx = {}
}) => {
  const isVisible = useResponsiveValue(visible, false)
  const contentNavStyles = {
    display: isVisible ? 'flex' : 'none',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '8px',
    order: REGION_ORDER.ContextArea
  }
  return <Box sx={merge<BetterSystemStyleObject>(contentNavStyles, sx)}>{children}</Box>
}

export type ParentLinkProps = {
  href?: string
} & PageHeaderProps

// TODO: add `as` and `aria-label` props
const ParentLink: React.FC<React.PropsWithChildren<ParentLinkProps>> = ({
  children,
  sx = {},
  href,
  visible = onlyVisibleOnNarrowView
}) => {
  const isVisible = useResponsiveValue(visible, false)
  return (
    <>
      <Link
        muted
        sx={merge<BetterSystemStyleObject>(
          {
            display: isVisible ? 'flex' : 'none',
            alignItems: 'center',
            // min touch target size 44px (20 + (12x2))
            lineHeight: '20px',
            paddingY: '12px',
            gap: '8px'
          },
          sx
        )}
        href={href}
      >
        <ArrowLeftIcon />
        <Box>{children}</Box>
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
  visible = onlyVisibleOnNarrowView
}) => {
  const isVisible = useResponsiveValue(visible, false)
  return <Box sx={merge<BetterSystemStyleObject>({display: isVisible ? 'flex' : 'none'}, sx)}>{children}</Box>
}

// ContextAreaActions
// ---------------------------------------------------------------------
const ContextAreaActions: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({
  children,
  sx = {},
  visible = onlyVisibleOnNarrowView
}) => {
  const isVisible = useResponsiveValue(visible, false)
  return (
    <Box
      sx={merge<BetterSystemStyleObject>(
        {
          display: isVisible ? 'flex' : 'none',
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
// PageHeader.TitleArea Sub Components: PageHeader.LeadingAction, PageHeader.LeadingVisual, PageHeader.Title, PageTitle.TrailingVisual, PageHeader.TrailingAction, PageHeader.Actions
// PageHeader.LeadingAction and PageHeader.TrailingAction are only visible on regular viewports therefore they come as hidden on narrow viewports and their visibility can be managed by their exposed `hidden` prop
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

const LeadingAction: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({
  children,
  sx = {},
  visible = visibleOnRegularView
}) => {
  const isVisible = useResponsiveValue(visible, true)
  return <Box sx={merge<BetterSystemStyleObject>({display: isVisible ? 'flex' : 'none'}, sx)}>{children}</Box>
}

const LeadingVisual: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({
  children,
  sx = {},
  visible = {
    narrow: true,
    regular: false,
    wide: false
  }
}) => {
  const isVisible = useResponsiveValue(visible, false)
  return (
    <Box
      sx={merge<BetterSystemStyleObject>(
        {
          display: isVisible ? 'flex' : 'none'
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
  // Check if we need responsive values for heading is so should we update as prop's type for Heading component?
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
} & PageHeaderProps

const Title: React.FC<React.PropsWithChildren<TitleProps>> = ({
  children,
  sx = {},
  variant = 'medium',
  visible = true,
  as = 'h3'
}) => {
  const currentVariant = useResponsiveValue(variant, 'medium')
  const isVisible = useResponsiveValue(visible, true)
  return (
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
            large: '400',
            medium: '400',
            subtitle: '400'
          }[currentVariant],
          display: isVisible ? 'flex' : 'none'
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
  visible = {
    narrow: false,
    regular: true,
    wide: true
  }
}) => {
  const isVisible = useResponsiveValue(visible, false)
  return (
    <Box
      sx={merge<BetterSystemStyleObject>(
        {
          display: isVisible ? 'flex' : 'none'
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
  visible = visibleOnRegularView
}) => {
  const isVisible = useResponsiveValue(visible, true)
  return <Box sx={merge<BetterSystemStyleObject>({display: isVisible ? 'flex' : 'none'}, sx)}>{children}</Box>
}

const Actions: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}, visible = true}) => {
  const isVisible = useResponsiveValue(visible, true)
  return (
    <Box
      sx={merge<BetterSystemStyleObject>(
        {
          display: isVisible ? 'flex' : 'none',
          flexDirection: 'row',
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

// PageHeader.Description: The description area of the header. Visible on all viewports
const Description: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}, visible = true}) => {
  const isVisible = useResponsiveValue(visible, true)
  return (
    <Box
      sx={merge<BetterSystemStyleObject>(
        {
          display: isVisible ? 'flex' : 'none',
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
const Navigation: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}, visible = true}) => {
  const isVisible = useResponsiveValue(visible, true)
  return (
    <Box
      sx={merge<BetterSystemStyleObject>(
        {
          display: isVisible ? 'block' : 'none'
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
  LeadingAction,
  LeadingVisual,
  Title,
  TrailingVisual,
  TrailingAction,
  Actions,
  Description,
  Navigation
})
