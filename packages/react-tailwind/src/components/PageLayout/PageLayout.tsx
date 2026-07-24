import React from 'react'
import {cn} from '../../internal/cn'
import {responsiveClasses, type ResponsiveValue} from '../Stack/responsive'
import {DragHandle} from './DragHandle'
import {PageLayoutMarkerContext} from './markers'
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
type Style = React.CSSProperties & Record<`--${string}`, string | undefined>

const spacing: Record<Spacing, string> = {none: 'p-0', condensed: 'p-4', normal: 'p-4 md:p-6'}
const rowGapClasses: Record<Spacing, string> = {none: 'gap-y-0', condensed: 'gap-y-4', normal: 'gap-y-6'}
const columnGapClasses: Record<Spacing, string> = {none: 'gap-x-0', condensed: 'gap-x-4', normal: 'gap-x-6'}
const width: Record<'full' | 'medium' | 'large' | 'xlarge', string> = {
  full: 'max-w-full',
  medium: 'max-w-3xl',
  large: 'max-w-5xl',
  xlarge: 'max-w-7xl',
}
const hidden = (value: ResponsiveValue<boolean> | undefined, visibleClass = 'block') =>
  responsiveClasses(value, {true: 'hidden', false: visibleClass}, false)

export interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  containerWidth?: keyof typeof width
  padding?: Spacing
  rowGap?: Spacing
  columnGap?: Spacing
}

const Root = React.forwardRef<HTMLDivElement, PageLayoutProps>(function PageLayout(
  {
    children,
    className,
    columnGap = 'normal',
    containerWidth = 'xlarge',
    padding = 'normal',
    rowGap = 'normal',
    ...rest
  },
  ref,
) {
  const markers = React.useContext(PageLayoutMarkerContext)
  return (
    <div {...rest} ref={ref} className={cn(spacing[padding], className)} data-component={markers.root}>
      <div
        className={cn(
          'mx-auto flex min-h-full w-full flex-col flex-wrap md:flex-row',
          rowGapClasses[rowGap],
          columnGapClasses[columnGap],
          width[containerWidth],
        )}
      >
        {children}
      </div>
    </div>
  )
})

export interface PageLayoutHeaderProps extends Omit<React.ComponentPropsWithoutRef<'header'>, 'hidden'> {
  padding?: Spacing
  divider?: 'none' | 'line' | ResponsiveValue<'none' | 'line' | 'filled'>
  hidden?: ResponsiveValue<boolean>
}
const Header = React.forwardRef<HTMLElement, PageLayoutHeaderProps>(function PageLayoutHeader(
  {children, className, divider = 'none', hidden: hiddenValue, padding = 'none', ...rest},
  ref,
) {
  const markers = React.useContext(PageLayoutMarkerContext)
  const dividerClass = responsiveClasses(
    divider,
    {none: 'hidden', line: 'h-px bg-default', filled: 'h-2 border-y border-default bg-inset'},
    'none',
  )
  const hasDivider =
    typeof divider === 'string' ? divider !== 'none' : Object.values(divider).some(value => value !== 'none')
  return (
    <header
      {...rest}
      ref={ref}
      className={cn('w-full', hidden(hiddenValue), className)}
      data-component={markers.header}
    >
      <div className={spacing[padding]}>{children}</div>
      {hasDivider ? <div aria-hidden="true" className={cn(dividerClass)} /> : null}
    </header>
  )
})

export interface PageLayoutContentProps extends Omit<React.HTMLAttributes<HTMLElement>, 'hidden'> {
  as?: React.ElementType
  width?: keyof typeof width
  padding?: Spacing
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
      className={cn('order-2 min-w-0 flex-1 basis-full md:basis-0', hidden(hiddenValue), className)}
      data-component={markers.content}
    >
      <div className={cn('mx-auto w-full', width[contentWidth], spacing[padding])}>{children}</div>
    </Component>
  )
})

export interface PageLayoutPaneBaseProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'hidden'> {
  position?: 'start' | 'end'
  width?: PaneWidthValue
  minWidth?: number
  widthStorageKey?: string
  padding?: Spacing
  divider?: 'none' | 'line'
  sticky?: boolean
  offsetHeader?: string | number
  hidden?: ResponsiveValue<boolean>
  resizable?: boolean
  currentWidth?: number
  onResizeEnd?: (width: number) => void
}
export type PageLayoutPaneProps = PageLayoutPaneBaseProps

const Pane = React.forwardRef<HTMLElement, PageLayoutPaneProps>(function Pane(
  {
    children,
    className,
    currentWidth: controlledWidth,
    divider = 'none',
    hidden: hiddenValue,
    minWidth = 256,
    offsetHeader = 0,
    onResizeEnd,
    padding = 'none',
    position = 'end',
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
  const paneRef = React.useRef<HTMLElement | null>(null)
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
  const paneStyle: Style = {
    '--pane-width': `${currentWidth}px`,
    '--pane-min-width': custom ? paneWidth.min : `${minWidth}px`,
    '--pane-max-width': custom ? paneWidth.max : `${maxPaneWidth}px`,
    '--offset-header': typeof offsetHeader === 'number' ? `${offsetHeader}px` : offsetHeader,
    ...style,
  }

  return (
    <aside
      {...rest}
      ref={node => {
        paneRef.current = node
        if (typeof forwardedRef === 'function') forwardedRef(node)
        else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node
      }}
      className={cn(
        'relative order-1 flex min-h-0 w-full min-w-[var(--pane-min-width)] max-w-[var(--pane-max-width)] shrink-0 flex-col overflow-auto md:order-none md:w-[var(--pane-width)] md:flex-row',
        position === 'start' ? 'md:order-1' : 'md:order-3',
        hidden(hiddenValue, 'flex'),
        sticky && 'sticky top-[var(--offset-header)] max-h-[calc(100vh-var(--offset-header))]',
        spacing[padding],
        className,
      )}
      data-position={position}
      style={paneStyle}
      suppressHydrationWarning={resizable && !onResizeEnd && Boolean(widthStorageKey)}
      data-component={markers.pane}
      data-resizable={resizable || undefined}
    >
      <div className="min-w-0 flex-1">{children}</div>
      {divider === 'line' || resizable ? (
        <div
          className={cn(
            'relative hidden w-px shrink-0 bg-default md:block',
            position === 'start' ? 'order-last' : 'order-first',
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
    </aside>
  )
})

export interface PageLayoutSidebarProps extends PageLayoutPaneBaseProps {
  responsiveVariant?: 'default' | 'fullscreen'
}
const Sidebar = React.forwardRef<HTMLDivElement, PageLayoutSidebarProps>(function PageLayoutSidebar(
  {className, responsiveVariant = 'default', widthStorageKey, ...rest},
  ref,
) {
  const markers = React.useContext(PageLayoutMarkerContext)
  return (
    <div
      ref={ref}
      className={cn(
        responsiveVariant === 'fullscreen' && 'max-md:fixed max-md:inset-0 max-md:z-2 max-md:bg-default',
        className,
      )}
      data-component={markers.sidebar}
    >
      <Pane {...rest} widthStorageKey={widthStorageKey} />
    </div>
  )
})

export interface PageLayoutFooterProps extends Omit<React.ComponentPropsWithoutRef<'footer'>, 'hidden'> {
  padding?: Spacing
  divider?: 'none' | 'line' | 'filled'
  hidden?: ResponsiveValue<boolean>
}
const Footer = React.forwardRef<HTMLElement, PageLayoutFooterProps>(function PageLayoutFooter(
  {children, className, divider = 'none', hidden: hiddenValue, padding = 'none', ...rest},
  ref,
) {
  const markers = React.useContext(PageLayoutMarkerContext)
  return (
    <footer
      {...rest}
      ref={ref}
      className={cn('order-4 w-full', hidden(hiddenValue), className)}
      data-component={markers.footer}
    >
      {divider !== 'none' ? (
        <div
          aria-hidden="true"
          className={cn(divider === 'filled' ? 'h-2 border-y border-default bg-inset' : 'h-px bg-default')}
        />
      ) : null}
      <div className={spacing[padding]}>{children}</div>
    </footer>
  )
})

Root.displayName = 'PageLayout'
Header.displayName = 'PageLayout.Header'
Content.displayName = 'PageLayout.Content'
Sidebar.displayName = 'PageLayout.Sidebar'
Footer.displayName = 'PageLayout.Footer'
export const PageLayout = Object.assign(Root, {Header, Content, Pane, Sidebar, Footer})
export type {CustomWidthOptions, PaneWidth, PaneWidthValue}
