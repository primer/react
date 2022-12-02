import React from 'react'
import {Box} from '..'
import {useResponsiveValue, ResponsiveValue} from '../hooks/useResponsiveValue'
import {SxProp, merge, BetterSystemStyleObject} from '../sx'
import Heading from '../Heading'
import {ArrowLeftIcon} from '@primer/octicons-react'
import Link from '../Link'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

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

// Default state for the `visible` prop when a sub component is only visible on narrow viewport
const hiddenOnRegularAndWide = {
  narrow: false,
  regular: true,
  wide: true
}

// Default state for the `visible` prop when a sub component is visible on regular and wide viewport
const hiddenOnNarrow = {
  narrow: true,
  regular: false,
  wide: false
}

// Root
// -----------------------------------------------------------------------------
export type PageHeaderProps = {
  'aria-label'?: React.AriaAttributes['aria-label']
  as?: React.ElementType
} & sharedPropTypes

const Root: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}}) => {
  const rootStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    // 24px for wide and regular, 16px for narrow viewports
    padding: useResponsiveValue(
      {
        narrow: 3,
        regular: 4,
        wide: 4
      },
      false
    )
  }
  return <Box sx={merge<BetterSystemStyleObject>(rootStyles, sx)}>{children}</Box>
}

// PageHeader.ContextArea : Only visible on narrow viewports by default to provide user context of where they are at their journey. `visible` prop available
// to manage their custom visibility but consumers should be careful if they choose to hide this on narrow viewports.
// PageHeader.ContextArea Sub Components: PageHeader.ParentLink, PageHeader.ContextBar, PageHeader.ContextAreaActions
// ---------------------------------------------------------------------

const ContextArea: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({
  children,
  hidden = hiddenOnRegularAndWide,
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
  return <Box sx={merge<BetterSystemStyleObject>(contentNavStyles, sx)}>{children}</Box>
}
// adopted from React.AnchorHTMLAttributes
type LinkProps = {
  download?: string
  href?: string
  hrefLang?: string
  media?: string
  ping?: string
  rel?: string
  target?: string
  type?: string
  referrerPolicy?: React.AnchorHTMLAttributes<HTMLAnchorElement>['referrerPolicy']
}
export type ParentLinkProps = PageHeaderProps & LinkProps

const ParentLink = React.forwardRef<HTMLAnchorElement, ParentLinkProps>(
  (
    {
      children,
      sx = {},
      href,
      'aria-label': ariaLabel = `Back to ${children}`,
      as = 'a',
      hidden = hiddenOnRegularAndWide
    },
    ref
  ) => {
    const isHidden = useResponsiveValue(hidden, false)
    return (
      <>
        <Link
          ref={ref}
          as={as}
          aria-label={ariaLabel}
          muted
          sx={merge<BetterSystemStyleObject>(
            {
              display: isHidden ? 'none' : 'flex',
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
) as PolymorphicForwardRefComponent<'a', ParentLinkProps>

// ContextBar
// Generic slot for any component above the title region. Use it for custom breadcrumbs and other navigation elements instead of ParentLink.
// ---------------------------------------------------------------------

const ContextBar: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({
  children,
  sx = {},
  hidden = hiddenOnRegularAndWide
}) => {
  const isHidden = useResponsiveValue(hidden, false)
  return <Box sx={merge<BetterSystemStyleObject>({display: isHidden ? 'none' : 'flex'}, sx)}>{children}</Box>
}

// ContextAreaActions
// ---------------------------------------------------------------------
const ContextAreaActions: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({
  children,
  sx = {},
  hidden = hiddenOnRegularAndWide
}) => {
  const isHidden = useResponsiveValue(hidden, false)
  return (
    <Box
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
// PageHeader.TitleArea Sub Components: PageHeader.LeadingAction, PageHeader.LeadingVisual, PageHeader.Title, PageTitle.TrailingVisual, PageHeader.TrailingAction, PageHeader.Actions
// PageHeader.LeadingAction and PageHeader.TrailingAction are only visible on regular viewports therefore they come as visible on narrow viewports and their visibility can be managed by their exposed `visible` prop
// ---------------------------------------------------------------------
const TitleArea: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}, hidden = false}) => {
  const isHidden = useResponsiveValue(hidden, false)
  return (
    <Box
      sx={merge<BetterSystemStyleObject>(
        {display: isHidden ? 'none' : 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px'},
        sx
      )}
    >
      {children}
    </Box>
  )
}

const LeadingAction: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({
  children,
  sx = {},
  hidden = hiddenOnNarrow
}) => {
  const isHidden = useResponsiveValue(hidden, false)
  return <Box sx={merge<BetterSystemStyleObject>({display: isHidden ? 'none' : 'flex'}, sx)}>{children}</Box>
}

const LeadingVisual: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}, hidden = false}) => {
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
  // Check if we need responsive values for heading is so should we update as prop's type for Heading component?
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
} & PageHeaderProps

const Title: React.FC<React.PropsWithChildren<TitleProps>> = ({
  children,
  sx = {},
  variant = 'medium',
  hidden = false,
  as = 'h3'
}) => {
  const currentVariant = useResponsiveValue(variant, 'medium')
  const isHidden = useResponsiveValue(hidden, false)
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
          display: isHidden ? 'none' : 'flex'
        },
        sx
      )}
    >
      {children}
    </Heading>
  )
}
const TrailingVisual: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}, hidden = false}) => {
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
  hidden = hiddenOnNarrow
}) => {
  const isHidden = useResponsiveValue(hidden, false)
  return <Box sx={merge<BetterSystemStyleObject>({display: isHidden ? 'none' : 'flex'}, sx)}>{children}</Box>
}

const Actions: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}, hidden = false}) => {
  const isHidden = useResponsiveValue(hidden, false)
  return (
    <Box
      sx={merge<BetterSystemStyleObject>(
        {
          display: isHidden ? 'none' : 'flex',
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
const Description: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}, hidden = false}) => {
  const isHidden = useResponsiveValue(hidden, true)
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
  LeadingAction,
  LeadingVisual,
  Title,
  TrailingVisual,
  TrailingAction,
  Actions,
  Description,
  Navigation
})
