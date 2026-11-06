'use client'

import React from 'react'
import {cn} from '../../internal/cn'
import {isMarkedWith, resolveRegions} from '../../internal/regions'
import {responsiveClasses} from '../../utils/responsive'
import type {AsProp, CSSPropertiesWithCustomProperties, RegionProps, ResponsiveValue} from '../../utils/types'
import {DragHandle} from './DragHandle'
import {
  markPageLayoutFooter,
  markPageLayoutHeader,
  markPageLayoutSidebar,
  PAGE_LAYOUT_FOOTER,
  PAGE_LAYOUT_HEADER,
  PAGE_LAYOUT_SIDEBAR,
  PageLayoutMarkerContext,
} from './markers'
import {
  defaultFormatValueText,
  isCustomWidthOptions,
  type CustomWidthOptions,
  type PaneWidth,
  type PaneWidthValue,
  updateAriaValues,
  usePaneWidth,
} from './usePaneWidth'

type Spacing = 'none' | 'condensed' | 'normal'

const spacing: Record<Spacing, string> = {none: 'p-0', condensed: 'p-4', normal: 'p-4 lg:p-6'}
const paddingVariableClasses: Record<Spacing, string> = {
  none: '[--page-layout-padding:0px]',
  condensed: '[--page-layout-padding:1rem]',
  normal: '[--page-layout-padding:1rem] lg:[--page-layout-padding:1.5rem]',
}
// Narrow horizontal dividers bleed through the root padding to the viewport edges.
const horizontalDividerBleed = 'max-md:-mx-[var(--page-layout-padding)]'
const rowGapClasses: Record<Spacing, string> = {none: 'gap-y-0', condensed: 'gap-y-4', normal: 'gap-y-4 lg:gap-y-6'}
const rowGapVariableClasses: Record<Spacing, string> = {
  none: '[--page-layout-row-gap:0px]',
  condensed: '[--page-layout-row-gap:1rem]',
  normal: '[--page-layout-row-gap:1rem] lg:[--page-layout-row-gap:1.5rem]',
}
const columnGapClasses: Record<Spacing, string> = {
  none: 'gap-x-0',
  condensed: 'gap-x-4',
  normal: 'gap-x-4 lg:gap-x-6',
}
const columnGapVariableClasses: Record<Spacing, string> = {
  none: '[--page-layout-column-gap:0px]',
  condensed: '[--page-layout-column-gap:1rem]',
  normal: '[--page-layout-column-gap:1rem] lg:[--page-layout-column-gap:1.5rem]',
}
const width: Record<'full' | 'medium' | 'large' | 'xlarge', string> = {
  full: 'max-w-full',
  medium: 'max-w-3xl',
  large: 'max-w-[1012px]',
  xlarge: 'max-w-7xl',
}
const hidden = (value: ResponsiveValue<boolean> | undefined, visibleClass = 'block') =>
  responsiveClasses(value, {true: 'hidden', false: visibleClass}, false)
type PanePosition = 'start' | 'end'
type PaneDivider = 'none' | 'line' | 'filled'

const panePositionClasses: Record<PanePosition, Record<'narrow' | 'regular' | 'wide', string>> = {
  start: {narrow: 'order-1', regular: 'md:order-1', wide: '2xl:order-1'},
  end: {narrow: 'order-3', regular: 'md:order-3', wide: '2xl:order-3'},
}
const sidebarPositionClasses: Record<PanePosition, Record<'narrow' | 'regular' | 'wide', string>> = {
  start: {narrow: 'order-first', regular: 'md:order-first', wide: '2xl:order-first'},
  end: {narrow: 'order-last', regular: 'md:order-last', wide: '2xl:order-last'},
}

const horizontalDividerClasses: Record<PaneDivider, Record<'narrow' | 'regular' | 'wide', string>> = {
  none: {narrow: 'hidden', regular: 'md:hidden', wide: '2xl:hidden'},
  line: {
    narrow: 'block h-px border-0 bg-[var(--borderColor-default)]',
    regular: 'md:block md:h-px md:border-0 md:bg-[var(--borderColor-default)]',
    wide: '2xl:block 2xl:h-px 2xl:border-0 2xl:bg-[var(--borderColor-default)]',
  },
  filled: {
    narrow: 'box-border block h-2 border-y border-default bg-inset',
    regular: 'md:box-border md:block md:h-2 md:border-y md:border-default md:bg-inset',
    wide: '2xl:box-border 2xl:block 2xl:h-2 2xl:border-y 2xl:border-default 2xl:bg-inset',
  },
}

const verticalDividerClasses: Record<PaneDivider, Record<'regular' | 'wide', string>> = {
  none: {regular: 'md:hidden', wide: '2xl:hidden'},
  line: {
    regular: 'md:block md:w-px md:border-0 md:bg-[var(--borderColor-default)]',
    wide: '2xl:block 2xl:w-px 2xl:border-0 2xl:bg-[var(--borderColor-default)]',
  },
  filled: {
    regular: 'md:box-border md:block md:w-2 md:border-x md:border-default md:bg-inset',
    wide: '2xl:box-border 2xl:block 2xl:w-2 2xl:border-x 2xl:border-default 2xl:bg-inset',
  },
}

type ResponsiveRange<T> = Partial<Record<'narrow' | 'regular' | 'wide', T>>

function resolveResponsiveValue<T extends string>(
  value: T | ResponsiveRange<T>,
  fallback: T,
): Record<'narrow' | 'regular' | 'wide', T> {
  if (typeof value === 'string') return {narrow: value, regular: value, wide: value}
  const regular = value.regular ?? fallback
  return {
    narrow: value.narrow ?? fallback,
    regular,
    wide: value.wide ?? regular,
  }
}

function responsivePanePositionClasses(value: ResponsiveValue<PanePosition> | undefined) {
  const position = resolveResponsiveValue(value ?? 'end', 'end')
  return (['narrow', 'regular', 'wide'] as const).map(viewport => panePositionClasses[position[viewport]][viewport])
}

function responsiveSidebarPositionClasses(value: ResponsiveValue<PanePosition> | undefined) {
  const position = resolveResponsiveValue(value ?? 'start', 'start')
  return (['narrow', 'regular', 'wide'] as const).map(viewport => sidebarPositionClasses[position[viewport]][viewport])
}

function responsiveHorizontalDividerClasses(value: ResponsiveValue<PaneDivider> | undefined) {
  const divider = resolveResponsiveValue(value ?? 'none', 'none')
  return (['narrow', 'regular', 'wide'] as const).map(viewport => horizontalDividerClasses[divider[viewport]][viewport])
}

function hasResponsiveDivider(value: ResponsiveValue<PaneDivider>) {
  return typeof value === 'string' ? value !== 'none' : Object.values(value).some(divider => divider !== 'none')
}

function getActivePanePosition(value: ResponsiveValue<PanePosition>) {
  const position = resolveResponsiveValue(value, 'end')
  if (typeof window === 'undefined') return position.wide
  if (window.innerWidth >= 1400) return position.wide
  if (window.innerWidth >= 768) return position.regular
  return position.narrow
}

export interface PageLayoutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    RegionProps<'header' | 'sidebar' | 'footer'> {
  /** Maximum width of the centered content column. */
  containerWidth?: keyof typeof width
  /** Spacing between the page container's outer edges and the viewport. */
  padding?: Spacing
  /** Vertical spacing between the header, content, and footer. */
  rowGap?: Spacing
  /** Horizontal spacing between the sidebar, content, and pane. */
  columnGap?: Spacing
}

const Root = React.forwardRef<HTMLDivElement, PageLayoutProps>(function PageLayout(
  {
    children,
    className,
    columnGap = 'normal',
    containerWidth = 'xlarge',
    footer: footerProp,
    header: headerProp,
    padding = 'normal',
    rowGap = 'normal',
    sidebar: sidebarProp,
    ...rest
  },
  ref,
) {
  const markers = React.useContext(PageLayoutMarkerContext)
  const {
    regions: {header, sidebar, footer},
    rest: content,
  } = resolveRegions(
    children,
    {
      header: {match: isMarkedWith(PAGE_LAYOUT_HEADER)},
      sidebar: {match: isMarkedWith(PAGE_LAYOUT_SIDEBAR)},
      footer: {match: isMarkedWith(PAGE_LAYOUT_FOOTER)},
    },
    {header: headerProp, sidebar: sidebarProp, footer: footerProp},
  )

  return (
    <div
      {...rest}
      ref={ref}
      className={cn(
        spacing[padding],
        paddingVariableClasses[padding],
        rowGapVariableClasses[rowGap],
        columnGapVariableClasses[columnGap],
        sidebar && 'flex flex-row',
        sidebar && columnGapClasses[columnGap],
        className,
      )}
      data-component={markers.root}
      data-has-sidebar={sidebar ? 'true' : undefined}
    >
      {sidebar}
      <div
        className={cn(
          'mx-auto flex h-full w-full flex-wrap',
          sidebar && 'min-w-0 shrink',
          rowGapClasses[rowGap],
          width[containerWidth],
        )}
      >
        {header}
        <div
          className={cn(
            'flex max-w-full flex-[1_1_100%] flex-col flex-nowrap md:flex-row md:flex-wrap',
            rowGapClasses[rowGap],
            columnGapClasses[columnGap],
          )}
        >
          {content}
        </div>
        {footer}
      </div>
    </div>
  )
})

export interface PageLayoutHeaderProps extends Omit<React.ComponentPropsWithoutRef<'header'>, 'hidden'> {
  /** Inner spacing of the header region. */
  padding?: Spacing
  /** Divider drawn below the header. Accepts a responsive object to vary it per viewport. */
  divider?: 'none' | 'line' | ResponsiveValue<'none' | 'line' | 'filled'>
  /** Hides the header. Accepts a responsive object to hide it only at some viewports. */
  hidden?: ResponsiveValue<boolean>
}
const Header = markPageLayoutHeader(
  React.forwardRef<HTMLElement, PageLayoutHeaderProps>(function PageLayoutHeader(
    {children, className, divider = 'none', hidden: hiddenValue, padding = 'none', ...rest},
    ref,
  ) {
    const markers = React.useContext(PageLayoutMarkerContext)
    const dividerClass = responsiveHorizontalDividerClasses(divider)
    return (
      <header
        {...rest}
        ref={ref}
        className={cn('w-full', hidden(hiddenValue), className)}
        data-component={markers.header}
      >
        <div className={spacing[padding]}>{children}</div>
        {hasResponsiveDivider(divider) ? (
          <div
            aria-hidden="true"
            className={cn('mt-[var(--page-layout-row-gap)]', horizontalDividerBleed, dividerClass)}
          />
        ) : null}
      </header>
    )
  }),
)

export interface PageLayoutContentProps extends Omit<React.HTMLAttributes<HTMLElement>, 'hidden'>, AsProp {
  /** Maximum width of the content column. */
  width?: keyof typeof width
  /** Inner spacing of the content region. */
  padding?: Spacing
  /** Hides the content. Accepts a responsive object to hide it only at some viewports. */
  hidden?: ResponsiveValue<boolean>
}
const Content = React.forwardRef<HTMLElement, PageLayoutContentProps>(function PageLayoutContent(
  {
    as: Component = 'main',
    children,
    className,
    hidden: hiddenValue,
    padding = 'none',
    width: contentWidth = 'full',
    ...rest
  },
  ref,
) {
  const markers = React.useContext(PageLayoutMarkerContext)
  return (
    <Component
      {...rest}
      ref={ref}
      className={cn(
        'order-2 flex min-w-0 flex-1 basis-full flex-col md:basis-0',
        hidden(hiddenValue, 'flex'),
        className,
      )}
      data-component={markers.content}
    >
      <div className={cn('mx-auto w-full grow', width[contentWidth], spacing[padding])}>{children}</div>
    </Component>
  )
})

export interface PageLayoutPaneBaseProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'hidden'> {
  /** Which side of the content the pane sits on. Accepts a responsive object to move it per viewport. */
  position?: ResponsiveValue<PanePosition>
  /**
   * Pane width, either a named size or a custom min/default/max triple.
   * @default 'medium'
   */
  width?: PaneWidthValue
  /**
   * Smallest width in pixels the pane may be resized to.
   * @default 256
   */
  minWidth?: number
  /** Key under which a resized width is persisted, so the pane reopens at the user's chosen size. */
  widthStorageKey?: string
  /** Inner spacing of the pane. */
  padding?: Spacing
  /** Divider drawn between the pane and the content. Accepts a responsive object to vary it per viewport. */
  divider?: ResponsiveValue<PaneDivider>
  /** Keeps the pane in view as the content scrolls. */
  sticky?: boolean
  /** Distance a sticky pane is offset from the top, to clear a fixed header above it. */
  offsetHeader?: string | number
  /** Hides the pane. Accepts a responsive object to hide it only at some viewports. */
  hidden?: ResponsiveValue<boolean>
  /** Lets the user drag the pane's edge to resize it. */
  resizable?: boolean
  /** Controls the pane width in pixels. Supply it with `onResizeEnd` to own the width yourself. */
  currentWidth?: number
  /** Called with the new width when a resize finishes. */
  onResizeEnd?: (width: number) => void
}
export type PageLayoutPaneProps = PageLayoutPaneBaseProps

const Pane = React.forwardRef<HTMLElement, PageLayoutPaneProps>(function Pane(
  {
    children,
    className,
    currentWidth: controlledWidth,
    divider: responsiveDivider = 'none',
    hidden: hiddenValue,
    minWidth = 256,
    offsetHeader = 0,
    onResizeEnd,
    padding = 'none',
    position: responsivePosition = 'end',
    resizable = false,
    sticky = false,
    style,
    width: paneWidth = 'medium',
    widthStorageKey = 'paneWidth',
    ...rest
  },
  forwardedRef,
) {
  const markers = React.useContext(PageLayoutMarkerContext)
  const isSidebar = markers.pane === markers.sidebar
  const paneRef = React.useRef<HTMLDivElement | null>(null)
  const handleRef = React.useRef<HTMLDivElement | null>(null)
  const dragStart = React.useRef({clientX: 0, width: 0, max: 0})
  const {currentWidth, currentWidthRef, getDefaultWidth, getMaxPaneWidth, maxPaneWidth, minPaneWidth, saveWidth} =
    usePaneWidth({
      width: paneWidth,
      minWidth,
      resizable,
      widthStorageKey,
      paneRef,
      handleRef,
      onResizeEnd,
      currentWidth: controlledWidth,
    })
  const writeWidth = (next: number) => {
    const rounded = Math.round(next)
    paneRef.current?.style.setProperty('--pane-width', `${rounded}px`)
    currentWidthRef.current = rounded
    updateAriaValues(
      handleRef.current,
      {current: rounded, min: minPaneWidth, max: getMaxPaneWidth()},
      defaultFormatValueText,
    )
  }
  const custom = isCustomWidthOptions(paneWidth)
  const positions = resolveResponsiveValue(responsivePosition, 'end')
  const dividers = resolveResponsiveValue(responsiveDivider, 'none')
  const verticalDividers = resizable ? resolveResponsiveValue<PaneDivider>('line', 'line') : dividers
  const hasHorizontalDivider = dividers.narrow !== 'none'
  const hasVerticalDivider = verticalDividers.regular !== 'none' || verticalDividers.wide !== 'none'
  const paneWrapperStyle: CSSPropertiesWithCustomProperties = {
    '--offset-header': typeof offsetHeader === 'number' ? `${offsetHeader}px` : offsetHeader,
    ...style,
  }
  const paneContentStyle: CSSPropertiesWithCustomProperties = {
    '--pane-width': `${currentWidth}px`,
    '--pane-min-width': custom ? paneWidth.min : `${minWidth}px`,
    '--pane-max-width': custom ? paneWidth.max : `${maxPaneWidth}px`,
  }

  return (
    <div
      {...rest}
      className={cn(
        'relative flex min-h-0 w-full shrink-0 flex-col md:w-auto md:flex-row',
        responsivePanePositionClasses(responsivePosition),
        hidden(hiddenValue, 'flex'),
        sticky && 'md:sticky md:top-[var(--offset-header)] md:max-h-screen md:self-start',
        className,
      )}
      data-position={typeof responsivePosition === 'string' ? responsivePosition : undefined}
      style={paneWrapperStyle}
      suppressHydrationWarning={resizable && !onResizeEnd && Boolean(widthStorageKey)}
    >
      {hasHorizontalDivider ? (
        <div
          aria-hidden="true"
          className={cn(
            horizontalDividerClasses[dividers.narrow].narrow,
            horizontalDividerBleed,
            'md:hidden 2xl:hidden',
            positions.narrow === 'start'
              ? 'order-last mt-[var(--page-layout-row-gap)]'
              : 'order-first mb-[var(--page-layout-row-gap)]',
          )}
        />
      ) : null}
      <div
        ref={node => {
          paneRef.current = node
          if (typeof forwardedRef === 'function') forwardedRef(node)
          else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node
        }}
        className={cn(
          'w-full min-w-0 flex-1 md:w-[var(--pane-width)] md:flex-none md:overflow-auto',
          (resizable || custom) &&
            'md:min-w-[var(--pane-min-width)] md:max-w-[var(--pane-max-width)] md:w-[clamp(var(--pane-min-width),var(--pane-width),var(--pane-max-width))]',
          isSidebar && 'h-full overflow-auto',
          spacing[padding],
        )}
        data-component={markers.pane}
        data-resizable={resizable || undefined}
        style={paneContentStyle}
      >
        {children}
      </div>
      {hasVerticalDivider ? (
        <div
          aria-hidden={resizable ? undefined : 'true'}
          className={cn(
            'relative hidden shrink-0 self-stretch',
            verticalDividerClasses[verticalDividers.regular].regular,
            verticalDividerClasses[verticalDividers.wide].wide,
            positions.regular === 'start' ? 'md:order-last' : 'md:order-first',
            positions.wide === 'start' ? '2xl:order-last' : '2xl:order-first',
            positions.regular === 'start'
              ? 'md:ml-[var(--page-layout-column-gap)] md:mr-0'
              : 'md:mr-[var(--page-layout-column-gap)] md:ml-0',
            positions.wide === 'start'
              ? '2xl:ml-[var(--page-layout-column-gap)] 2xl:mr-0'
              : '2xl:mr-[var(--page-layout-column-gap)] 2xl:ml-0',
          )}
        >
          {resizable ? (
            <DragHandle
              handleRef={handleRef}
              aria-valuemin={minPaneWidth}
              aria-valuemax={maxPaneWidth}
              aria-valuenow={currentWidth}
              onDragStart={clientX => {
                dragStart.current = {
                  clientX,
                  width: paneRef.current?.getBoundingClientRect().width ?? currentWidthRef.current,
                  max: getMaxPaneWidth(),
                }
              }}
              onDrag={(value, isKeyboard) => {
                const position = getActivePanePosition(responsivePosition)
                const directed = position === 'end' ? -value : value
                const next = isKeyboard
                  ? currentWidthRef.current + directed
                  : dragStart.current.width +
                    (position === 'end' ? -(value - dragStart.current.clientX) : value - dragStart.current.clientX)
                writeWidth(
                  Math.max(minPaneWidth, Math.min(isKeyboard ? getMaxPaneWidth() : dragStart.current.max, next)),
                )
              }}
              onDragEnd={() => saveWidth(currentWidthRef.current)}
              onDoubleClick={() => {
                const next = getDefaultWidth()
                writeWidth(next)
                saveWidth(next)
              }}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  )
})

// A sidebar sticks to the viewport rather than below a header, so it has no `offsetHeader`.
export interface PageLayoutSidebarProps extends Omit<PageLayoutPaneBaseProps, 'offsetHeader'> {
  /** How the sidebar behaves on narrow viewports: inline by default, or as a fullscreen overlay. */
  responsiveVariant?: 'default' | 'fullscreen'
}
const Sidebar = markPageLayoutSidebar(
  React.forwardRef<HTMLDivElement, PageLayoutSidebarProps>(function PageLayoutSidebar(
    {
      className,
      divider = 'none',
      hidden: hiddenValue = false,
      padding = 'none',
      position: responsivePosition = 'start',
      responsiveVariant = 'default',
      resizable = false,
      style,
      sticky = false,
      widthStorageKey,
      ...rest
    },
    ref,
  ) {
    const markers = React.useContext(PageLayoutMarkerContext)
    const sidebarDivider = resolveResponsiveValue(divider, 'none')
    const sidebarPosition = resolveResponsiveValue(responsivePosition, 'start')
    const narrowDivider = resizable ? 'line' : sidebarDivider.narrow
    const narrowDividerNode =
      narrowDivider === 'none' ? null : (
        <div
          aria-hidden="true"
          className={cn(
            'shrink-0 self-stretch md:hidden',
            sidebarPosition.narrow === 'start'
              ? 'order-last ms-[var(--page-layout-column-gap)]'
              : 'order-first me-[var(--page-layout-column-gap)]',
            narrowDivider === 'line'
              ? 'w-px bg-[var(--borderColor-default)]'
              : 'box-border w-2 border-x border-default bg-inset',
          )}
        />
      )
    return (
      <div
        ref={ref}
        className={cn(
          'flex h-full shrink-0 flex-row',
          responsiveSidebarPositionClasses(responsivePosition),
          hidden(hiddenValue, 'flex'),
          sticky && 'sticky top-0 h-screen',
          responsiveVariant === 'fullscreen' &&
            'max-md:fixed max-md:inset-0 max-md:z-[999] max-md:block max-md:h-screen max-md:w-screen max-md:bg-default',
          className,
        )}
        data-position={typeof responsivePosition === 'string' ? responsivePosition : undefined}
        data-responsive-variant={responsiveVariant}
        style={style}
      >
        {sidebarPosition.narrow === 'end' ? narrowDividerNode : null}
        <PageLayoutMarkerContext.Provider value={{...markers, pane: markers.sidebar}}>
          <Pane
            {...rest}
            className="block h-full md:flex"
            divider={{narrow: 'none', regular: sidebarDivider.regular, wide: sidebarDivider.wide}}
            hidden={false}
            padding={padding}
            // Pane falls back to `end` for omitted ranges, so it gets the sidebar's fully resolved position.
            position={typeof responsivePosition === 'string' ? responsivePosition : sidebarPosition}
            resizable={resizable}
            sticky={false}
            // A sidebar persists its width only under a key it is given, so it never shares the pane's.
            widthStorageKey={widthStorageKey ?? ''}
          />
        </PageLayoutMarkerContext.Provider>
        {sidebarPosition.narrow === 'start' ? narrowDividerNode : null}
      </div>
    )
  }),
)

export interface PageLayoutFooterProps extends Omit<React.ComponentPropsWithoutRef<'footer'>, 'hidden'> {
  /** Inner spacing of the footer region. */
  padding?: Spacing
  /** Divider drawn above the footer. Accepts a responsive object to vary it per viewport. */
  divider?: 'none' | 'line' | ResponsiveValue<'none' | 'line' | 'filled'>
  /** Hides the footer. Accepts a responsive object to hide it only at some viewports. */
  hidden?: ResponsiveValue<boolean>
}
const Footer = markPageLayoutFooter(
  React.forwardRef<HTMLElement, PageLayoutFooterProps>(function PageLayoutFooter(
    {children, className, divider = 'none', hidden: hiddenValue, padding = 'none', ...rest},
    ref,
  ) {
    const markers = React.useContext(PageLayoutMarkerContext)
    const dividerClass = responsiveHorizontalDividerClasses(divider)
    return (
      <footer
        {...rest}
        ref={ref}
        className={cn('order-4 w-full', hidden(hiddenValue), className)}
        data-component={markers.footer}
      >
        {hasResponsiveDivider(divider) ? (
          <div
            aria-hidden="true"
            className={cn('mb-[var(--page-layout-row-gap)]', horizontalDividerBleed, dividerClass)}
          />
        ) : null}
        <div className={spacing[padding]}>{children}</div>
      </footer>
    )
  }),
)

Root.displayName = 'PageLayout'
Header.displayName = 'PageLayout.Header'
Content.displayName = 'PageLayout.Content'
Sidebar.displayName = 'PageLayout.Sidebar'
Footer.displayName = 'PageLayout.Footer'
export const PageLayout = Object.assign(Root, {Header, Content, Pane, Sidebar, Footer})
export type {CustomWidthOptions, PaneWidth, PaneWidthValue}
