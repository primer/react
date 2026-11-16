'use client'

import React from 'react'
import {cn} from '../../internal/cn'
import {mergeRefs} from '../../internal/refs'
import {isMarkedWith, resolveRegions} from '../../internal/regions'
import {responsiveClasses} from '../../utils/responsive'
import type {AsProp, CSSPropertiesWithCustomProperties, RegionProps, ResponsiveValue} from '../../utils/types'
import {useOverflowWithFocusRetention} from '../ScrollableRegion/useOverflow'
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

interface PageLayoutResizeTargets {
  contentRef: React.RefObject<HTMLElement | null>
  sidebarWrapperRef: React.RefObject<HTMLDivElement | null>
}

const PageLayoutResizeContext = React.createContext<PageLayoutResizeTargets | null>(null)

const spacing: Record<Spacing, string> = {
  none: 'primer:p-0',
  condensed: 'primer:p-4',
  normal: 'primer:p-4 primer:lg:p-6',
}
const paddingVariableClasses: Record<Spacing, string> = {
  none: 'primer:[--page-layout-padding:0px]',
  condensed: 'primer:[--page-layout-padding:1rem]',
  normal: 'primer:[--page-layout-padding:1rem] primer:lg:[--page-layout-padding:1.5rem]',
}
// Narrow horizontal dividers bleed through the root padding to the viewport edges.
const horizontalDividerBleed = 'primer:max-md:-mx-[var(--page-layout-padding)]'
const rowGapClasses: Record<Spacing, string> = {
  none: 'primer:gap-y-0',
  condensed: 'primer:gap-y-4',
  normal: 'primer:gap-y-4 primer:lg:gap-y-6',
}
const rowGapVariableClasses: Record<Spacing, string> = {
  none: 'primer:[--page-layout-row-gap:0px]',
  condensed: 'primer:[--page-layout-row-gap:1rem]',
  normal: 'primer:[--page-layout-row-gap:1rem] primer:lg:[--page-layout-row-gap:1.5rem]',
}
const columnGapClasses: Record<Spacing, string> = {
  none: 'primer:gap-x-0',
  condensed: 'primer:gap-x-4',
  normal: 'primer:gap-x-4 primer:lg:gap-x-6',
}
const columnGapVariableClasses: Record<Spacing, string> = {
  none: 'primer:[--page-layout-column-gap:0px]',
  condensed: 'primer:[--page-layout-column-gap:1rem]',
  normal: 'primer:[--page-layout-column-gap:1rem] primer:lg:[--page-layout-column-gap:1.5rem]',
}
const width: Record<'full' | 'medium' | 'large' | 'xlarge', string> = {
  full: 'primer:max-w-full',
  medium: 'primer:max-w-3xl',
  large: 'primer:max-w-[1012px]',
  xlarge: 'primer:max-w-7xl',
}
const hidden = (value: ResponsiveValue<boolean> | undefined, visibleClass = 'block') =>
  responsiveClasses(value, {true: 'hidden', false: visibleClass}, false)
type PanePosition = 'start' | 'end'
type PaneDivider = 'none' | 'line' | 'filled'

const panePositionClasses: Record<PanePosition, Record<'narrow' | 'regular' | 'wide', string>> = {
  start: {narrow: 'primer:order-1', regular: 'primer:md:order-1', wide: 'primer:2xl:order-1'},
  end: {narrow: 'primer:order-3', regular: 'primer:md:order-3', wide: 'primer:2xl:order-3'},
}
const sidebarPositionClasses: Record<PanePosition, Record<'narrow' | 'regular' | 'wide', string>> = {
  start: {narrow: 'primer:order-first', regular: 'primer:md:order-first', wide: 'primer:2xl:order-first'},
  end: {narrow: 'primer:order-last', regular: 'primer:md:order-last', wide: 'primer:2xl:order-last'},
}

const horizontalDividerClasses: Record<PaneDivider, Record<'narrow' | 'regular' | 'wide', string>> = {
  none: {narrow: 'primer:hidden', regular: 'primer:md:hidden', wide: 'primer:2xl:hidden'},
  line: {
    narrow: 'primer:block primer:h-px primer:border-0 primer:bg-[var(--borderColor-default)]',
    regular: 'primer:md:block primer:md:h-px primer:md:border-0 primer:md:bg-[var(--borderColor-default)]',
    wide: 'primer:2xl:block primer:2xl:h-px primer:2xl:border-0 primer:2xl:bg-[var(--borderColor-default)]',
  },
  filled: {
    narrow: 'primer:box-border primer:block primer:h-2 primer:border-y primer:border-default primer:bg-inset',
    regular:
      'primer:md:box-border primer:md:block primer:md:h-2 primer:md:border-y primer:md:border-default primer:md:bg-inset',
    wide: 'primer:2xl:box-border primer:2xl:block primer:2xl:h-2 primer:2xl:border-y primer:2xl:border-default primer:2xl:bg-inset',
  },
}

const verticalDividerClasses: Record<PaneDivider, Record<'regular' | 'wide', string>> = {
  none: {regular: 'primer:md:hidden', wide: 'primer:2xl:hidden'},
  line: {
    regular: 'primer:md:block primer:md:w-px primer:md:border-0 primer:md:bg-[var(--borderColor-default)]',
    wide: 'primer:2xl:block primer:2xl:w-px primer:2xl:border-0 primer:2xl:bg-[var(--borderColor-default)]',
  },
  filled: {
    regular:
      'primer:md:box-border primer:md:block primer:md:w-2 primer:md:border-x primer:md:border-default primer:md:bg-inset',
    wide: 'primer:2xl:box-border primer:2xl:block primer:2xl:w-2 primer:2xl:border-x primer:2xl:border-default primer:2xl:bg-inset',
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

function getActivePanePosition(value: ResponsiveValue<PanePosition>, element: HTMLElement | null) {
  const position = resolveResponsiveValue(value, 'end')
  const view = element?.ownerDocument.defaultView
  if (!view) return position.wide
  if (view.innerWidth >= 1400) return position.wide
  if (view.innerWidth >= 768) return position.regular
  return position.narrow
}

function isRightToLeft(element: HTMLElement | null) {
  return element?.ownerDocument.defaultView?.getComputedStyle(element).direction === 'rtl'
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
  /** Classes applied to the centered wrapper containing the header, content row, and footer. */
  wrapperClassName?: string
  /** Classes applied to the row containing the content and pane, not to `PageLayout.Content` itself. */
  contentRowClassName?: string
}

const Root = React.forwardRef<HTMLDivElement, PageLayoutProps>(function PageLayout(
  {
    children,
    className,
    columnGap = 'normal',
    containerWidth = 'xlarge',
    contentRowClassName,
    footer: footerProp,
    header: headerProp,
    padding = 'normal',
    rowGap = 'normal',
    sidebar: sidebarProp,
    wrapperClassName,
    ...rest
  },
  ref,
) {
  const markers = React.useContext(PageLayoutMarkerContext)
  const contentRef = React.useRef<HTMLElement | null>(null)
  const sidebarWrapperRef = React.useRef<HTMLDivElement | null>(null)
  const resizeTargets = React.useMemo(() => ({contentRef, sidebarWrapperRef}), [])
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
    <PageLayoutResizeContext.Provider value={resizeTargets}>
      <div
        {...rest}
        ref={ref}
        className={cn(
          spacing[padding],
          paddingVariableClasses[padding],
          rowGapVariableClasses[rowGap],
          columnGapVariableClasses[columnGap],
          sidebar && 'primer:flex primer:flex-row',
          sidebar && columnGapClasses[columnGap],
          className,
        )}
        data-component={markers.root}
        data-has-sidebar={sidebar ? 'true' : undefined}
      >
        {sidebar}
        <div
          ref={sidebarWrapperRef}
          className={cn(
            'primer:mx-auto primer:flex primer:h-full primer:w-full primer:flex-wrap',
            sidebar && 'primer:min-w-0 primer:shrink',
            rowGapClasses[rowGap],
            width[containerWidth],
            wrapperClassName,
          )}
        >
          {header}
          <div
            className={cn(
              'primer:flex primer:max-w-full primer:flex-[1_1_100%] primer:flex-col primer:flex-nowrap primer:md:flex-row primer:md:flex-wrap',
              rowGapClasses[rowGap],
              columnGapClasses[columnGap],
              contentRowClassName,
            )}
          >
            {content}
          </div>
          {footer}
        </div>
      </div>
    </PageLayoutResizeContext.Provider>
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
        className={cn('primer:w-full', hidden(hiddenValue), className)}
        data-component={markers.header}
      >
        <div className={spacing[padding]}>{children}</div>
        {hasResponsiveDivider(divider) ? (
          <div
            aria-hidden="true"
            className={cn('primer:mt-[var(--page-layout-row-gap)]', horizontalDividerBleed, dividerClass)}
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
  const contentRef = React.useContext(PageLayoutResizeContext)?.contentRef
  const mergedRef = React.useMemo(() => mergeRefs(ref, contentRef), [ref, contentRef])
  return (
    <Component
      {...rest}
      ref={mergedRef}
      className={cn(
        'primer:order-2 primer:flex primer:min-w-0 primer:flex-1 primer:basis-full primer:flex-col primer:md:basis-0',
        hidden(hiddenValue, 'flex'),
        className,
      )}
      data-component={markers.content}
    >
      <div className={cn('primer:mx-auto primer:w-full primer:grow', width[contentWidth], spacing[padding])}>
        {children}
      </div>
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

interface InternalPaneProps extends PageLayoutPaneProps {
  fillSidebar?: boolean
}

const PaneContent = React.forwardRef<HTMLElement, InternalPaneProps>(function PaneContent(
  {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    children,
    className,
    currentWidth: controlledWidth,
    divider: responsiveDivider = 'none',
    fillSidebar = false,
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
  const resizeTargets = React.useContext(PageLayoutResizeContext)
  const isSidebar = markers.pane === markers.sidebar
  const paneRef = React.useRef<HTMLElement | null>(null)
  const [paneElement, setPaneElement] = React.useState<HTMLElement | null>(null)
  const setPaneRef = React.useMemo(() => mergeRefs<HTMLElement>(paneRef, setPaneElement, forwardedRef), [forwardedRef])
  const needsOverflowRegion = useOverflowWithFocusRetention(paneElement)
  const handleRef = React.useRef<HTMLDivElement | null>(null)
  const dragStart = React.useRef({clientX: 0, width: 0, max: 0, rightToLeft: false})
  const horizontalKeyboardRtl = React.useRef(false)
  const {currentWidth, currentWidthRef, getDefaultWidth, getMaxPaneWidth, maxPaneWidth, minPaneWidth, saveWidth} =
    usePaneWidth({
      width: paneWidth,
      minWidth,
      resizable,
      widthStorageKey,
      paneRef,
      handleRef,
      constrainToViewport: isSidebar,
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
    '--pane-max-width': custom && (!resizable || !isSidebar) ? paneWidth.max : `${maxPaneWidth}px`,
  }

  return (
    <div
      {...rest}
      className={cn(
        'primer:relative primer:flex primer:min-h-0 primer:w-full primer:shrink-0 primer:flex-col primer:md:w-auto primer:md:flex-row',
        fillSidebar && 'primer:min-w-0 primer:flex-1',
        responsivePanePositionClasses(responsivePosition),
        hidden(hiddenValue, 'flex'),
        sticky && 'primer:md:sticky primer:md:top-[var(--offset-header)] primer:md:max-h-screen primer:md:self-start',
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
            'primer:md:hidden primer:2xl:hidden',
            positions.narrow === 'start'
              ? 'primer:order-last primer:mt-[var(--page-layout-row-gap)]'
              : 'primer:order-first primer:mb-[var(--page-layout-row-gap)]',
          )}
        />
      ) : null}
      <div
        ref={setPaneRef}
        className={cn(
          'primer:w-full primer:min-w-0 primer:md:overflow-auto',
          fillSidebar && 'primer:flex-1',
          !fillSidebar && 'primer:md:w-[var(--pane-width)] primer:md:flex-none',
          !fillSidebar &&
            (resizable || custom) &&
            'primer:md:min-w-[var(--pane-min-width)] primer:md:max-w-[var(--pane-max-width)] primer:md:w-[clamp(var(--pane-min-width),var(--pane-width),var(--pane-max-width))]',
          isSidebar && 'primer:h-full primer:overflow-auto',
          spacing[padding],
        )}
        {...(needsOverflowRegion
          ? {
              role: 'region',
              tabIndex: 0,
              'aria-label': ariaLabelledBy ? undefined : ariaLabel,
              'aria-labelledby': ariaLabelledBy,
            }
          : {})}
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
            'primer:relative primer:hidden primer:shrink-0 primer:self-stretch',
            verticalDividerClasses[verticalDividers.regular].regular,
            verticalDividerClasses[verticalDividers.wide].wide,
            positions.regular === 'start' ? 'primer:md:order-last' : 'primer:md:order-first',
            positions.wide === 'start' ? 'primer:2xl:order-last' : 'primer:2xl:order-first',
            positions.regular === 'start'
              ? 'primer:md:ml-[var(--page-layout-column-gap)] primer:md:mr-0'
              : 'primer:md:mr-[var(--page-layout-column-gap)] primer:md:ml-0',
            positions.wide === 'start'
              ? 'primer:2xl:ml-[var(--page-layout-column-gap)] primer:2xl:mr-0'
              : 'primer:2xl:mr-[var(--page-layout-column-gap)] primer:2xl:ml-0',
          )}
        >
          {resizable ? (
            <DragHandle
              handleRef={handleRef}
              dragTargetRef={paneRef}
              contentWrapperRef={isSidebar ? resizeTargets?.sidebarWrapperRef : resizeTargets?.contentRef}
              aria-label={ariaLabel?.trim() ? ariaLabel : undefined}
              aria-labelledby={ariaLabelledBy?.trim() ? ariaLabelledBy : undefined}
              aria-valuemin={minPaneWidth}
              aria-valuemax={maxPaneWidth}
              aria-valuenow={currentWidth}
              onKeyDownCapture={event => {
                horizontalKeyboardRtl.current =
                  (event.key === 'ArrowLeft' || event.key === 'ArrowRight') && isRightToLeft(event.currentTarget)
              }}
              onDragStart={clientX => {
                dragStart.current = {
                  clientX,
                  width: paneRef.current?.getBoundingClientRect().width ?? currentWidthRef.current,
                  max: getMaxPaneWidth(),
                  rightToLeft: isRightToLeft(handleRef.current),
                }
              }}
              onDrag={(value, isKeyboard) => {
                const position = getActivePanePosition(responsivePosition, handleRef.current)
                const rightToLeft = isKeyboard ? horizontalKeyboardRtl.current : dragStart.current.rightToLeft
                const delta = isKeyboard ? value : value - dragStart.current.clientX
                const directed = (position === 'end') !== rightToLeft ? -delta : delta
                const next = (isKeyboard ? currentWidthRef.current : dragStart.current.width) + directed
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

const Pane = React.forwardRef<HTMLElement, PageLayoutPaneProps>(function Pane(props, ref) {
  return <PaneContent {...props} ref={ref} />
})

// A sidebar sticks to the viewport rather than below a header, so it has no `offsetHeader`.
export interface PageLayoutSidebarProps extends Omit<PageLayoutPaneBaseProps, 'offsetHeader'> {
  /** How the sidebar behaves on narrow viewports: inline by default, or as a fullscreen overlay. */
  responsiveVariant?: 'default' | 'fullscreen'
  /**
   * Fills the sidebar's CSS-sized outer rail instead of applying the pane's pixel width.
   * Fill mode is only supported for non-resizable sidebars.
   */
  widthMode?: 'default' | 'fill'
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
      widthMode = 'default',
      widthStorageKey,
      ...rest
    },
    ref,
  ) {
    if (widthMode === 'fill' && resizable) {
      throw new Error('PageLayout.Sidebar widthMode="fill" does not support resizing')
    }

    const markers = React.useContext(PageLayoutMarkerContext)
    const sidebarDivider = resolveResponsiveValue(divider, 'none')
    const sidebarPosition = resolveResponsiveValue(responsivePosition, 'start')
    const narrowDivider = resizable ? 'line' : sidebarDivider.narrow
    const narrowDividerNode =
      narrowDivider === 'none' ? null : (
        <div
          aria-hidden="true"
          className={cn(
            'primer:shrink-0 primer:self-stretch primer:md:hidden',
            sidebarPosition.narrow === 'start'
              ? 'primer:order-last primer:ms-[var(--page-layout-column-gap)]'
              : 'primer:order-first primer:me-[var(--page-layout-column-gap)]',
            narrowDivider === 'line'
              ? 'primer:w-px primer:bg-[var(--borderColor-default)]'
              : 'primer:box-border primer:w-2 primer:border-x primer:border-default primer:bg-inset',
          )}
        />
      )
    return (
      <div
        ref={ref}
        className={cn(
          'primer:flex primer:h-full primer:shrink-0 primer:flex-row',
          widthMode === 'fill' && 'primer:min-w-0 primer:w-full',
          responsiveSidebarPositionClasses(responsivePosition),
          hidden(hiddenValue, 'flex'),
          sticky && 'primer:sticky primer:top-0 primer:h-screen',
          responsiveVariant === 'fullscreen' &&
            'primer:max-md:fixed primer:max-md:inset-0 primer:max-md:z-[999] primer:max-md:block primer:max-md:h-screen primer:max-md:w-screen primer:max-md:bg-default',
          className,
        )}
        data-position={typeof responsivePosition === 'string' ? responsivePosition : undefined}
        data-responsive-variant={responsiveVariant}
        style={style}
      >
        {sidebarPosition.narrow === 'end' ? narrowDividerNode : null}
        <PageLayoutMarkerContext.Provider value={{...markers, pane: markers.sidebar}}>
          <PaneContent
            {...rest}
            className="primer:block primer:h-full primer:md:flex"
            divider={{narrow: 'none', regular: sidebarDivider.regular, wide: sidebarDivider.wide}}
            fillSidebar={widthMode === 'fill'}
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
        className={cn('primer:order-4 primer:w-full', hidden(hiddenValue), className)}
        data-component={markers.footer}
      >
        {hasResponsiveDivider(divider) ? (
          <div
            aria-hidden="true"
            className={cn('primer:mb-[var(--page-layout-row-gap)]', horizontalDividerBleed, dividerClass)}
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
