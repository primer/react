import React, {useEffect} from 'react'
import Box from '../Box'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import {useResponsiveValue} from '../hooks/useResponsiveValue'
import type {SxProp, BetterSystemStyleObject, CSSCustomProperties} from '../sx'
import {merge} from '../sx'
import Heading from '../Heading'
import {ArrowLeftIcon} from '@primer/octicons-react'
import type {LinkProps as BaseLinkProps} from '../Link'
import Link from '../Link'

import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {getBreakpointDeclarations} from '../utils/getBreakpointDeclarations'
import {warning} from '../utils/warning'
import {useProvidedRefOrCreate} from '../hooks'

const GRID_ROW_ORDER = {
  ContextArea: 1,
  LeadingAction: 2,
  Breadcrumbs: 2,
  TitleArea: 2,
  TrailingAction: 2,
  Actions: 2,
  Description: 3,
  Navigation: 4,
}

const TITLE_AREA_REGION_ORDER = {
  LeadingVisual: 0,
  Title: 1,
  TrailingVisual: 2,
}

const CONTEXT_AREA_REGION_ORDER = {
  ParentLink: 0,
  ContextBar: 1,
  ContextAreaActions: 2,
}

// Types that are shared between PageHeader children components
export type ChildrenPropTypes = {
  className?: string
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
  className?: string
} & SxProp

const Root = React.forwardRef<HTMLDivElement, React.PropsWithChildren<PageHeaderProps>>(
  ({children, className, sx = {}, as = 'div'}, forwardedRef) => {
    const rootStyles = {
      display: 'grid',
      // We have max 5 columns.
      gridTemplateColumns: 'auto auto auto auto 1fr',
      gridTemplateAreas: `
      'context-area context-area context-area context-area context-area'
      'leading-action  breadcrumbs title-area trailing-action actions'
      'description description description description description'
      'navigation navigation navigation navigation navigation'
    `,
      // line-height is calculated with calc(height/font-size) and the below numbers are from @primer/primitives
      //  --custom-font-size, --custom-line-height, --custom-font-weight are custom properties (passed by sx) that can be used to override the below values
      // We don't want these values to be overriden but still want to allow consumers to override them if needed.
      '&:has([data-component="TitleArea"][data-size-variant="large"])': {
        fontSize: 'var(--custom-font-size, var(--text-title-size-large, 2rem))',
        lineHeight: 'var(--custom-line-height, var(--text-title-lineHeight-large, 1.5))', // calc(48/32)
        fontWeight: 'var(--custom-font-weight, var(--base-text-weight-normal, 400))',
        '--title-line-height': 'var(--custom-line-height, var(--text-title-lineHeight-large, 1.5))',
      },
      '&:has([data-component="TitleArea"][data-size-variant="medium"])': {
        fontSize: 'var(--custom-font-size, var(--text-title-size-medium, 1.25rem))',
        lineHeight: 'var(--custom-line-height, var(--text-title-lineHeight-medium, 1.6))', // calc(32/20)
        fontWeight: 'var(--custom-font-weight, var(--base-text-weight-semibold, 600))',
        '--title-line-height': 'var(--custom-line-height, var(--text-title-lineHeight-medium, 1.6))',
      },
      '&:has([data-component="TitleArea"][data-size-variant="subtitle"])': {
        fontSize: 'var(--custom-font-size, var(--text-title-size-medium, 1.25rem))',
        lineHeight: 'var(--custom-line-height, var(--text-title-lineHeight-medium, 1.6))', // calc(32/20)
        fontWeight: 'var(--custom-font-weight, var(--base-text-weight-normal, 400))',
        '--title-line-height': 'var(--custom-line-height, var(--text-title-lineHeight-medium, 1.6))',
      },
      '[data-component="PH_LeadingAction"], [data-component="PH_TrailingAction"],[data-component="PH_Actions"], [data-component="PH_LeadingVisual"], [data-component="PH_TrailingVisual"]':
        {
          height: 'calc(var(--title-line-height) * 1em)',
        },
    }

    const rootRef = useProvidedRefOrCreate<HTMLDivElement>(forwardedRef as React.RefObject<HTMLDivElement>)

    const isInteractive = (element: HTMLElement) => {
      return (
        ['a', 'button'].some(selector => element.matches(selector)) ||
        (element.hasAttribute('role') && element.getAttribute('role') === 'button') ||
        (element.hasAttribute('link') && element.getAttribute('role') === 'link') ||
        element.hasAttribute('tabindex')
      )
    }

    useEffect(
      function validateInteractiveElementsInTitle() {
        if (!__DEV__) return

        let hasContextArea = false
        let hasLeadingAction = false

        if (!rootRef.current || rootRef.current.children.length <= 0) return
        const titleArea = Array.from(rootRef.current.children as HTMLCollection).find(child => {
          return child instanceof HTMLElement && child.getAttribute('data-component') === 'TitleArea'
        })

        // It is very unlikely to have a PageHeader without a TitleArea, but we still want to make sure we don't break the page if that happens.
        if (!titleArea) return

        for (const child of React.Children.toArray(children)) {
          if (React.isValidElement(child) && child.type === ContextArea) {
            hasContextArea = true
          }
          if (React.isValidElement(child) && child.type === LeadingAction) {
            hasLeadingAction = true
          }
        }
        // Check if TitleArea has any interactive children or grandchildren.
        const hasInteractiveContent = Array.from(titleArea.childNodes).some(child => {
          return (
            (child instanceof HTMLElement && isInteractive(child)) ||
            Array.from(child.childNodes).some(child => {
              return child instanceof HTMLElement && isInteractive(child)
            })
          )
        })
        // PageHeader.TitleArea is be the first element in the DOM even when it is not visually the first.
        // Motivation behind this rule to make sure context area and leading action (if they exist) are always rendered after the title (a heading tag)
        // so that screen reader users who are navigating via heading menu won't miss these actions.
        warning(
          hasInteractiveContent && (hasContextArea || hasLeadingAction),
          'When PageHeader.ContextArea or PageHeader.LeadingAction is present, we recommended not to include any interactive items in the PageHeader.TitleArea to make sure the focus order is logical.',
        )
      },
      [children, rootRef],
    )
    return (
      <Box ref={rootRef} as={as} className={className} sx={merge<BetterSystemStyleObject>(rootStyles, sx)}>
        {children}
      </Box>
    )
  },
) as PolymorphicForwardRefComponent<'div', PageHeaderProps>

// PageHeader.ContextArea : Only visible on narrow viewports by default to provide user context of where they are at their journey. `hidden` prop available
// to manage their custom visibility but consumers should be careful if they choose to hide this on narrow viewports.
// PageHeader.ContextArea Sub Components: PageHeader.ParentLink, PageHeader.ContextBar, PageHeader.ContextAreaActions
// ---------------------------------------------------------------------
const ContextArea: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  className,
  hidden = hiddenOnRegularAndWide,
  sx = {},
}) => {
  const contentNavStyles = {
    gridRow: GRID_ROW_ORDER.ContextArea,
    gridArea: 'context-area',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: '0.5rem',
    gap: '0.5rem',

    ...getBreakpointDeclarations(hidden, 'display', value => {
      return value ? 'none' : 'flex'
    }),
    fontWeight: 'initial',
    lineHeight: 'var(--text-body-lineHeight-medium, 1.4285)',
    fontSize: 'var(--text-body-size-medium, 0.875rem)',
  }

  return (
    <Box className={className} sx={merge<BetterSystemStyleObject>(contentNavStyles, sx)}>
      {children}
    </Box>
  )
}
type LinkProps = Pick<
  React.AnchorHTMLAttributes<HTMLAnchorElement> & BaseLinkProps,
  'download' | 'href' | 'hrefLang' | 'media' | 'ping' | 'rel' | 'target' | 'type' | 'referrerPolicy' | 'as'
> & {
  'aria-label'?: React.AriaAttributes['aria-label']
}
export type ParentLinkProps = React.PropsWithChildren<ChildrenPropTypes & LinkProps>

// PageHeader.ParentLink : Only visible on narrow viewports by default to let users navigate up in the hierarchy.
const ParentLink = React.forwardRef<HTMLAnchorElement, ParentLinkProps>(
  ({children, className, sx = {}, href, 'aria-label': ariaLabel, as = 'a', hidden = hiddenOnRegularAndWide}, ref) => {
    return (
      <>
        <Link
          ref={ref}
          as={as}
          aria-label={ariaLabel}
          muted
          className={className}
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
ParentLink.displayName = 'ParentLink'

// ContextBar
// Generic slot for any component above the title region. Use it for custom breadcrumbs and other navigation elements instead of ParentLink.
// ---------------------------------------------------------------------

const ContextBar: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  className,
  sx = {},
  hidden = hiddenOnRegularAndWide,
}) => {
  return (
    <Box
      className={className}
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
  className,
  sx = {},
  hidden = hiddenOnRegularAndWide,
}) => {
  return (
    <Box
      className={className}
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

type TitleAreaProps = {
  variant?: 'subtitle' | 'medium' | 'large' | ResponsiveValue<'subtitle' | 'medium' | 'large'>
} & ChildrenPropTypes
// PageHeader.TitleArea: The main title area of the page. Visible on all viewports.
// PageHeader.TitleArea Sub Components: PageHeader.LeadingVisual, PageHeader.Title, PageTitle.TrailingVisual
// ---------------------------------------------------------------------

const TitleArea = React.forwardRef<HTMLDivElement, React.PropsWithChildren<TitleAreaProps>>(
  ({children, className, sx = {}, hidden = false, variant = 'medium'}, forwardedRef) => {
    const titleAreaRef = useProvidedRefOrCreate<HTMLDivElement>(forwardedRef as React.RefObject<HTMLDivElement>)
    const currentVariant = useResponsiveValue(variant, 'medium')
    return (
      <Box
        className={className}
        ref={titleAreaRef}
        data-component="TitleArea"
        data-size-variant={currentVariant}
        sx={merge<BetterSystemStyleObject>(
          {
            gridRow: GRID_ROW_ORDER.TitleArea,
            gridArea: 'title-area',
            display: 'flex',
            gap: '0.5rem',
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
    )
  },
) as PolymorphicForwardRefComponent<'div', TitleAreaProps>
TitleArea.displayName = 'TitleArea'

// PageHeader.LeadingAction and PageHeader.TrailingAction should only be visible on regular viewports.
// So they come as hidden on narrow viewports by default and their visibility can be managed by their `hidden` prop.
const LeadingAction: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  className,
  sx = {},
  hidden = hiddenOnNarrow,
}) => {
  const style: CSSCustomProperties = {}
  // @ts-ignore sx has height attribute
  const {height} = sx
  if (height) style['--custom-height'] = height
  return (
    <Box
      className={className}
      data-component="PH_LeadingAction"
      sx={merge<BetterSystemStyleObject>(
        {
          gridRow: GRID_ROW_ORDER.LeadingAction,
          gridArea: 'leading-action',
          paddingRight: '0.5rem',
          display: 'flex',
          ...getBreakpointDeclarations(hidden, 'display', value => {
            return value ? 'none' : 'flex'
          }),
          alignItems: 'center',
        },
        sx,
      )}
      style={style}
    >
      {children}
    </Box>
  )
}

// This is reserved for only breadcrumbs.
const Breadcrumbs: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  className,
  sx = {},
  hidden = false,
}) => {
  return (
    <Box
      className={className}
      data-component="PH_Breadcrumbs"
      sx={merge<BetterSystemStyleObject>(
        {
          gridRow: GRID_ROW_ORDER.Breadcrumbs,
          gridArea: 'breadcrumbs',
          paddingRight: '0.5rem',
          display: 'flex',
          ...getBreakpointDeclarations(hidden, 'display', value => {
            return value ? 'none' : 'flex'
          }),
          alignItems: 'center',
          fontWeight: 'initial',
          lineHeight: 'var(--text-body-lineHeight-medium, 1.4285)',
          fontSize: 'var(--text-body-size-medium, 0.875rem)',
        },
        sx,
      )}
    >
      {children}
    </Box>
  )
}

// PageHeader.LeadingVisual and PageHeader.TrailingVisual should remain visible on narrow viewports.
const LeadingVisual: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  className,
  sx = {},
  hidden = false,
}) => {
  const style: CSSCustomProperties = {}
  // @ts-ignore sx has height attribute
  const {height} = sx
  if (height) style['--custom-height'] = height
  return (
    <Box
      className={className}
      data-component="PH_LeadingVisual"
      sx={merge<BetterSystemStyleObject>(
        {
          // using flex and order to display the leading visual in the title area.
          display: 'flex',
          order: TITLE_AREA_REGION_ORDER.LeadingVisual,
          ...getBreakpointDeclarations(hidden, 'display', value => {
            return value ? 'none' : 'flex'
          }),
          alignItems: 'center',
        },
        sx,
      )}
      style={style}
    >
      {children}
    </Box>
  )
}

export type TitleProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
} & ChildrenPropTypes

const Title: React.FC<React.PropsWithChildren<TitleProps>> = ({
  children,
  className,
  sx = {},
  hidden = false,
  as = 'h2',
}) => {
  const style: CSSCustomProperties = {}
  // @ts-ignore sxProp can have color attribute
  const {fontSize, lineHeight, fontWeight} = sx
  if (fontSize) style['--custom-font-size'] = fontSize
  if (lineHeight) style['--custom-line-height'] = lineHeight
  if (fontWeight) style['--custom-font-weight'] = fontWeight

  return (
    <Heading
      className={className}
      data-component="PH_Title"
      as={as}
      style={style}
      sx={merge<BetterSystemStyleObject>(
        {
          // using flex and order to display the title in the title area.
          display: 'flex',
          order: TITLE_AREA_REGION_ORDER.Title,
          ...getBreakpointDeclarations(hidden, 'display', value => {
            return value ? 'none' : 'block'
          }),
          fontSize: 'inherit',
          fontWeight: 'inherit',
        },
        sx,
      )}
    >
      {children}
    </Heading>
  )
}

// PageHeader.LeadingVisual and PageHeader.TrailingVisual should remain visible on narrow viewports.
const TrailingVisual: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  className,
  sx = {},
  hidden = false,
}) => {
  const style: CSSCustomProperties = {}
  // @ts-ignore sx has height attribute
  const {height} = sx
  if (height) style['--custom-height'] = height
  return (
    <Box
      className={className}
      data-component="PH_TrailingVisual"
      sx={merge<BetterSystemStyleObject>(
        {
          // using flex and order to display the trailing visual in the title area.
          display: 'flex',
          order: TITLE_AREA_REGION_ORDER.TrailingVisual,
          ...getBreakpointDeclarations(hidden, 'display', value => {
            return value ? 'none' : 'flex'
          }),
          alignItems: 'center',
        },
        sx,
      )}
      style={style}
    >
      {children}
    </Box>
  )
}

const TrailingAction: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  className,
  sx = {},
  hidden = hiddenOnNarrow,
}) => {
  const style: CSSCustomProperties = {}
  // @ts-ignore sx has height attribute
  const {height} = sx
  if (height) style['--custom-height'] = height
  return (
    <Box
      className={className}
      data-component="PH_TrailingAction"
      sx={merge<BetterSystemStyleObject>(
        {
          gridRow: GRID_ROW_ORDER.TrailingAction,
          gridArea: 'trailing-action',
          paddingLeft: '0.5rem',
          display: 'flex',
          ...getBreakpointDeclarations(hidden, 'display', value => {
            return value ? 'none' : 'flex'
          }),
          alignItems: 'center',
        },
        sx,
      )}
      style={style}
    >
      {children}
    </Box>
  )
}

const Actions: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  className,
  sx = {},
  hidden = false,
}) => {
  const style: CSSCustomProperties = {}
  // @ts-ignore sx has height attribute
  const {height} = sx
  if (height) style['--custom-height'] = height
  return (
    <Box
      className={className}
      data-component="PH_Actions"
      sx={merge<BetterSystemStyleObject>(
        {
          gridRow: GRID_ROW_ORDER.Actions,
          gridArea: 'actions',
          display: 'flex',
          ...getBreakpointDeclarations(hidden, 'display', value => {
            return value ? 'none' : 'flex'
          }),
          flexDirection: 'row',
          paddingLeft: '0.5rem',
          gap: '0.5rem',
          minWidth: 'max-content',
          justifyContent: 'right',
          alignItems: 'center',
        },
        sx,
      )}
      style={style}
    >
      {children}
    </Box>
  )
}

// PageHeader.Description: The description area of the header. Visible on all viewports
const Description: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  className,
  sx = {},
  hidden = false,
}) => {
  return (
    <Box
      className={className}
      sx={merge<BetterSystemStyleObject>(
        {
          gridRow: GRID_ROW_ORDER.Description,
          gridArea: 'description',
          display: 'flex',
          ...getBreakpointDeclarations(hidden, 'display', value => {
            return value ? 'none' : 'flex'
          }),
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: '0.5rem',
          gap: '0.5rem',
          fontWeight: 'initial',
          lineHeight: 'var(--text-body-lineHeight-medium, 1.4285)',
          fontSize: 'var(--text-body-size-medium, 0.875rem)',
        },
        sx,
      )}
    >
      {children}
    </Box>
  )
}

export type NavigationProps = {
  as?: 'nav' | 'div'
  'aria-label'?: React.AriaAttributes['aria-label']
  'aria-labelledby'?: React.AriaAttributes['aria-labelledby']
} & ChildrenPropTypes

// PageHeader.Navigation: The local navigation area of the header. Visible on all viewports
const Navigation: React.FC<React.PropsWithChildren<NavigationProps>> = ({
  children,
  className,
  sx = {},
  hidden = false,
  as,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}) => {
  warning(
    as === 'nav' && !ariaLabel && !ariaLabelledBy,
    'Use `aria-label` or `aria-labelledby` prop to provide an accessible label to the `nav` landmark for assistive technology',
  )

  return (
    <Box
      as={as}
      // Render `aria-label` and `aria-labelledby` only on `nav` elements
      aria-label={as === 'nav' ? ariaLabel : undefined}
      aria-labelledby={as === 'nav' ? ariaLabelledBy : undefined}
      className={className}
      sx={merge<BetterSystemStyleObject>(
        {
          gridRow: GRID_ROW_ORDER.Navigation,
          gridArea: 'navigation',
          paddingTop: '0.5rem',
          display: 'flex',
          ...getBreakpointDeclarations(hidden, 'display', value => {
            return value ? 'none' : 'block'
          }),
          fontWeight: 'initial',
          lineHeight: 'var(--text-body-lineHeight-medium, 1.4285)',
          fontSize: 'var(--text-body-size-medium, 0.875rem)',
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
  TitleArea,
  ContextAreaActions,
  LeadingAction,
  Breadcrumbs,
  LeadingVisual,
  Title,
  TrailingVisual,
  TrailingAction,
  Actions,
  Description,
  Navigation,
})

PageHeader.displayName = 'PageHeader'
