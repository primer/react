import React from 'react'
import {Box} from '..'
import {useResponsiveValue, ResponsiveValue} from '../hooks/useResponsiveValue'
import {SxProp, merge, BetterSystemStyleObject} from '../sx'
import Heading from '../Heading'
import {ArrowLeftIcon} from '@primer/octicons-react'
import Link, {LinkProps as BaseLinkProps} from '../Link'

import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {getBreakpointDeclarations} from '../utils/getBreakpointDeclarations'
const REGION_ORDER = {
  ContextArea: 0,
  TitleArea: 1,
  Description: 2,
  Navigation: 3,
}

const CONTEXT_AREA_REGION_ORDER = {
  ParentLink: 0,
  ContextBar: 1,
  ContextAreaActions: 2,
}

const TITLE_AREA_REGION_ORDER = {
  LeadingAction: 0,
  LeadingVisual: 1,
  Title: 2,
  TrailingVisual: 3,
  TrailingAction: 4,
  Actions: 5,
}

// Types that are shared between PageHeader children components
export type ChildrenPropTypes = {
  hidden?: boolean | ResponsiveValue<boolean>
} & SxProp

// Default state for the `visible` prop when a sub component is only visible on narrow viewport
const hiddenOnRegularAndWide = {
  narrow: false,
  regular: true,
  wide: true,
}

// Default state for the `visible` prop when a sub component is visible on regular and wide viewport
const hiddenOnNarrow = {
  narrow: true,
  regular: false,
  wide: false,
}

// Root
// -----------------------------------------------------------------------------
export type PageHeaderProps = {
  'aria-label'?: React.AriaAttributes['aria-label']
  as?: React.ElementType | 'header' | 'div'
} & SxProp

const Root: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({children, sx = {}, as = 'div'}) => {
  const rootStyles = {
    display: 'flex',
    flexDirection: 'column',
    // TODO: We used hard-coded values for the spacing and font size in this component. Update them to use new design tokens when they are ready to use.
    gap: '0.5rem',
  }
  return (
    <Box as={as} sx={merge<BetterSystemStyleObject>(rootStyles, sx)}>
      {children}
    </Box>
  )
}

// PageHeader.ContextArea : Only visible on narrow viewports by default to provide user context of where they are at their journey. `hidden` prop available
// to manage their custom visibility but consumers should be careful if they choose to hide this on narrow viewports.
// PageHeader.ContextArea Sub Components: PageHeader.ParentLink, PageHeader.ContextBar, PageHeader.ContextAreaActions
// ---------------------------------------------------------------------
const ContextArea: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  hidden = hiddenOnRegularAndWide,
  sx = {},
}) => {
  const contentNavStyles = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '0.5rem',
    order: REGION_ORDER.ContextArea,
    ...getBreakpointDeclarations(hidden, 'display', value => {
      return value ? 'none' : 'flex'
    }),
  }

  return <Box sx={merge<BetterSystemStyleObject>(contentNavStyles, sx)}>{children}</Box>
}
type LinkProps = Pick<
  React.AnchorHTMLAttributes<HTMLAnchorElement> & BaseLinkProps,
  'download' | 'href' | 'hrefLang' | 'media' | 'ping' | 'rel' | 'target' | 'type' | 'referrerPolicy' | 'as'
> & {
  'aria-label'?: React.AriaAttributes['aria-label']
}
export type ParentLinkProps = React.PropsWithChildren<ChildrenPropTypes & LinkProps>

const ParentLink = React.forwardRef<HTMLAnchorElement, ParentLinkProps>(
  (
    {
      children,
      sx = {},
      href,
      'aria-label': ariaLabel = `Back to ${children}`,
      as = 'a',
      hidden = hiddenOnRegularAndWide,
    },
    ref,
  ) => {
    return (
      <>
        <Link
          ref={ref}
          as={as}
          aria-label={ariaLabel}
          muted
          sx={merge<BetterSystemStyleObject>(
            {
              display: 'flex',
              alignItems: 'center',
              order: CONTEXT_AREA_REGION_ORDER.ParentLink,
              gap: '0.5rem',
              ...getBreakpointDeclarations(hidden, 'display', value => {
                return value ? 'none' : 'flex'
              }),
            },
            sx,
          )}
          href={href}
        >
          <ArrowLeftIcon />
          <Box>{children}</Box>
        </Link>
      </>
    )
  },
) as PolymorphicForwardRefComponent<'a', ParentLinkProps>

// ContextBar
// Generic slot for any component above the title region. Use it for custom breadcrumbs and other navigation elements instead of ParentLink.
// ---------------------------------------------------------------------

const ContextBar: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  sx = {},
  hidden = hiddenOnRegularAndWide,
}) => {
  return (
    <Box
      sx={merge<BetterSystemStyleObject>(
        {
          display: 'flex',
          order: CONTEXT_AREA_REGION_ORDER.ContextBar,
          ...getBreakpointDeclarations(hidden, 'display', value => {
            return value ? 'none' : 'flex'
          }),
        },
        sx,
      )}
    >
      {children}
    </Box>
  )
}

// ContextAreaActions
// ---------------------------------------------------------------------
const ContextAreaActions: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  sx = {},
  hidden = hiddenOnRegularAndWide,
}) => {
  return (
    <Box
      sx={merge<BetterSystemStyleObject>(
        {
          display: 'flex',
          flexDirection: 'row',
          order: CONTEXT_AREA_REGION_ORDER.ContextAreaActions,
          alignItems: 'center',
          gap: '0.5rem',
          flexGrow: '1',
          justifyContent: 'right',
          ...getBreakpointDeclarations(hidden, 'display', value => {
            return value ? 'none' : 'flex'
          }),
        },
        sx,
      )}
    >
      {children}
    </Box>
  )
}

const MEDIUM_TITLE_HEIGHT = '2rem'
const LARGE_TITLE_HEIGHT = '3rem'

const TitleAreaContext = React.createContext<{
  titleVariant: 'subtitle' | 'medium' | 'large'
  titleAreaHeight?: string | number
}>({
  titleVariant: 'medium',
  titleAreaHeight: MEDIUM_TITLE_HEIGHT,
})

type TitleAreaProps = {
  variant?: 'subtitle' | 'medium' | 'large' | ResponsiveValue<'subtitle' | 'medium' | 'large'>
} & ChildrenPropTypes
// PageHeader.TitleArea: The main title area of the page. Visible on all viewports.
// PageHeader.TitleArea Sub Components: PageHeader.LeadingAction, PageHeader.LeadingVisual, PageHeader.Title, PageTitle.TrailingVisual, PageHeader.TrailingAction, PageHeader.Actions
// PageHeader.LeadingAction and PageHeader.TrailingAction are only visible on regular viewports therefore they come as visible on narrow viewports and their visibility can be managed by their exposed `visible` prop
// ---------------------------------------------------------------------

const TitleArea: React.FC<React.PropsWithChildren<TitleAreaProps>> = ({
  children,
  sx = {},
  hidden = false,
  variant = 'medium',
}) => {
  const currentVariant = useResponsiveValue(variant, 'medium')
  const height = currentVariant === 'large' ? LARGE_TITLE_HEIGHT : MEDIUM_TITLE_HEIGHT
  return (
    <TitleAreaContext.Provider value={{titleVariant: currentVariant, titleAreaHeight: height}}>
      <Box
        sx={merge<BetterSystemStyleObject>(
          {
            display: 'flex',
            gap: '0.5rem',
            order: REGION_ORDER.TitleArea,
            ...getBreakpointDeclarations(hidden, 'display', value => {
              return value ? 'none' : 'flex'
            }),
            flexDirection: 'row',
            alignItems: 'flex-start',
          },
          sx,
        )}
      >
        {children}
      </Box>
    </TitleAreaContext.Provider>
  )
}

const LeadingAction: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  sx = {},
  hidden = hiddenOnNarrow,
}) => {
  const {titleAreaHeight} = React.useContext(TitleAreaContext)

  return (
    <Box
      sx={merge<BetterSystemStyleObject>(
        {
          display: 'flex',
          order: TITLE_AREA_REGION_ORDER.LeadingAction,
          ...getBreakpointDeclarations(hidden, 'display', value => {
            return value ? 'none' : 'flex'
          }),
          alignItems: 'center',
          height: titleAreaHeight,
        },
        sx,
      )}
    >
      {children}
    </Box>
  )
}

const LeadingVisual: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({children, sx = {}, hidden = false}) => {
  const {titleAreaHeight} = React.useContext(TitleAreaContext)
  return (
    <Box
      sx={merge<BetterSystemStyleObject>(
        {
          display: 'flex',
          order: TITLE_AREA_REGION_ORDER.LeadingVisual,
          ...getBreakpointDeclarations(hidden, 'display', value => {
            return value ? 'none' : 'flex'
          }),
          alignItems: 'center',
          height: titleAreaHeight,
        },
        sx,
      )}
    >
      {children}
    </Box>
  )
}

export type TitleProps = {
  // Check if we need responsive values for heading is so should we update as prop's type for Heading component?
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
} & ChildrenPropTypes

const Title: React.FC<React.PropsWithChildren<TitleProps>> = ({children, sx = {}, hidden = false, as = 'h3'}) => {
  const {titleVariant} = React.useContext(TitleAreaContext)
  return (
    <Heading
      as={as}
      sx={merge<BetterSystemStyleObject>(
        {
          fontSize: {
            large: '2rem',
            medium: '1.25rem',
            subtitle: '1.25rem',
          }[titleVariant],
          // line-height is calculated with calc(height/font-size) and the below numbers are from @primer/primitives
          lineHeight: {
            large: 1.5, // calc(48/32)
            medium: 1.6, // calc(32/20)
            subtitle: 1.6, // calc(32/20)
          }[titleVariant],
          fontWeight: {
            large: '400',
            medium: '600',
            subtitle: '400',
          }[titleVariant],
          display: 'flex',
          order: TITLE_AREA_REGION_ORDER.Title,
          ...getBreakpointDeclarations(hidden, 'display', value => {
            return value ? 'none' : 'flex'
          }),
        },
        sx,
      )}
    >
      {children}
    </Heading>
  )
}
const TrailingVisual: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({children, sx = {}, hidden = false}) => {
  const {titleAreaHeight} = React.useContext(TitleAreaContext)

  return (
    <Box
      sx={merge<BetterSystemStyleObject>(
        {
          display: 'flex',
          order: TITLE_AREA_REGION_ORDER.TrailingVisual,
          ...getBreakpointDeclarations(hidden, 'display', value => {
            return value ? 'none' : 'flex'
          }),
          alignItems: 'center',
          height: titleAreaHeight,
        },
        sx,
      )}
    >
      {children}
    </Box>
  )
}

const TrailingAction: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  sx = {},
  hidden = hiddenOnNarrow,
}) => {
  const {titleAreaHeight} = React.useContext(TitleAreaContext)

  return (
    <Box
      sx={merge<BetterSystemStyleObject>(
        {
          display: 'flex',
          order: TITLE_AREA_REGION_ORDER.TrailingAction,
          ...getBreakpointDeclarations(hidden, 'display', value => {
            return value ? 'none' : 'flex'
          }),
          alignItems: 'center',
          height: titleAreaHeight,
        },
        sx,
      )}
    >
      {children}
    </Box>
  )
}

const Actions: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({children, sx = {}, hidden = false}) => {
  const {titleAreaHeight} = React.useContext(TitleAreaContext)
  return (
    <Box
      sx={merge<BetterSystemStyleObject>(
        {
          display: 'flex',
          order: TITLE_AREA_REGION_ORDER.Actions,
          ...getBreakpointDeclarations(hidden, 'display', value => {
            return value ? 'none' : 'flex'
          }),
          flexDirection: 'row',
          gap: '0.5rem',
          flexGrow: '1',
          justifyContent: 'right',
          height: titleAreaHeight,
          alignItems: 'center',
        },
        sx,
      )}
    >
      {children}
    </Box>
  )
}

// PageHeader.Description: The description area of the header. Visible on all viewports
const Description: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({children, sx = {}, hidden = false}) => {
  return (
    <Box
      sx={merge<BetterSystemStyleObject>(
        {
          display: 'flex',
          order: REGION_ORDER.Description,
          ...getBreakpointDeclarations(hidden, 'display', value => {
            return value ? 'none' : 'flex'
          }),
          flexDirection: 'row',
          alignItems: 'center',
          gap: '0.5rem',
        },
        sx,
      )}
    >
      {children}
    </Box>
  )
}

// PageHeader.Navigation: The local navigation area of the header. Visible on all viewports
const Navigation: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({children, sx = {}, hidden = false}) => {
  return (
    <Box
      sx={merge<BetterSystemStyleObject>(
        {
          display: 'flex',
          order: REGION_ORDER.Navigation,
          ...getBreakpointDeclarations(hidden, 'display', value => {
            return value ? 'none' : 'block'
          }),
        },
        sx,
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
  Navigation,
})
