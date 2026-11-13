'use client'

import React from 'react'
import {flushSync} from 'react-dom'
import {flattenChildren} from '../../internal/children'
import {CloseIconButton} from '../../internal/CloseIconButton'
import {cn} from '../../internal/cn'
import {getFocusableChild} from '../../internal/getFocusableChild'
import {mergeRefs} from '../../internal/refs'
import {AnchoredOverlay} from '../AnchoredOverlay'
import {Button} from '../Button'

export interface LabelGroupProps extends Omit<React.HTMLAttributes<HTMLElement>, 'data-component'> {
  /** Customize the element type of the rendered container. */
  as?: React.ElementType
  /** How hidden children are shown. */
  overflowStyle?: 'inline' | 'overlay'
  /** How many children to show. `'auto'` truncates children to fit the available width. */
  visibleChildCount?: 'auto' | number
}

const itemClassName =
  'primer:flex primer:shrink-0 primer:items-center primer:data-[hidden]:order-last primer:data-[hidden]:pointer-events-none primer:data-[hidden]:invisible'
/**
 * A config component for the established compact-label overflow pattern. It keeps
 * consumer-authored children in order while providing the measurement and
 * accessible disclosure behavior that consumers otherwise repeat.
 */
export const LabelGroup = React.forwardRef<HTMLElement, LabelGroupProps>(function LabelGroup(
  {as: Component = 'ul', children, className, overflowStyle = 'overlay', visibleChildCount, ...rest},
  ref,
) {
  const containerRef = React.useRef<HTMLElement>(null)
  const rootRef = React.useMemo(() => mergeRefs(containerRef, ref), [ref])
  const itemRefs = React.useRef<Array<HTMLElement | null>>([])
  const toggleRef = React.useRef<HTMLElement>(null)
  const expandButtonRef = React.useRef<HTMLElement>(null)
  const collapseButtonRef = React.useRef<HTMLElement>(null)
  const itemWidthsRef = React.useRef<number[]>([])
  const toggleWidthRef = React.useRef(0)
  const childrenArray = flattenChildren(children)
  const childCount = childrenArray.length
  const isList = Component === 'ul' || Component === 'ol'
  const ItemWrapper = isList ? 'li' : 'span'
  const ToggleWrapper = isList ? 'li' : 'span'
  const [autoHiddenCount, setAutoHiddenCount] = React.useState(0)
  const [isInlineExpanded, setIsInlineExpanded] = React.useState(false)
  const [isOverlayOpen, setIsOverlayOpen] = React.useState(false)
  const isTruncated = visibleChildCount !== undefined
  const numericHiddenCount =
    typeof visibleChildCount === 'number' ? Math.max(0, childCount - Math.max(0, visibleChildCount)) : 0
  const hiddenCount =
    visibleChildCount === 'auto' && !isInlineExpanded
      ? autoHiddenCount
      : typeof visibleChildCount === 'number' && !isInlineExpanded
        ? numericHiddenCount
        : 0

  const measure = React.useCallback(() => {
    if (visibleChildCount !== 'auto' || isInlineExpanded) return

    const container = containerRef.current
    if (!container) return

    const computedStyle = getComputedStyle(container)
    const paddingInline =
      (Number.parseFloat(computedStyle.paddingLeft) || 0) + (Number.parseFloat(computedStyle.paddingRight) || 0)
    const containerWidth = (container.clientWidth || container.getBoundingClientRect().width) - paddingInline
    if (!containerWidth) return

    for (const [index, item] of itemRefs.current.entries()) {
      const width = item?.getBoundingClientRect().width ?? 0
      if (width > 0) itemWidthsRef.current[index] = width
    }

    const toggleWidth = toggleRef.current?.getBoundingClientRect().width ?? 0
    if (toggleWidth > 0) toggleWidthRef.current = toggleWidth

    const gap = Number.parseFloat(computedStyle.columnGap) || 4
    const getVisibleCount = (availableWidth: number) => {
      let usedWidth = 0
      let count = 0
      for (const width of itemWidthsRef.current.slice(0, childCount)) {
        if (!width || usedWidth + (count ? gap : 0) + width > availableWidth) break
        usedWidth += (count ? gap : 0) + width
        count += 1
      }
      return count
    }

    const initiallyVisible = getVisibleCount(containerWidth)
    const visibleCount =
      initiallyVisible === childCount
        ? childCount
        : getVisibleCount(Math.max(0, containerWidth - toggleWidthRef.current))

    setAutoHiddenCount(previous => {
      const next = Math.max(0, childCount - visibleCount)
      return previous === next ? previous : next
    })
  }, [childCount, isInlineExpanded, visibleChildCount])

  React.useEffect(() => {
    if (visibleChildCount !== 'auto' || isInlineExpanded) return

    measure()
    if (typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(measure)
    if (containerRef.current) observer.observe(containerRef.current)
    for (const item of itemRefs.current) {
      if (item) observer.observe(item)
    }
    if (toggleRef.current) observer.observe(toggleRef.current)
    return () => observer.disconnect()
  }, [autoHiddenCount, childCount, isInlineExpanded, measure, visibleChildCount])

  const expandInline = () => {
    const firstHiddenIndex = childCount - hiddenCount
    flushSync(() => setIsInlineExpanded(true))
    queueMicrotask(() => {
      const firstHiddenChild = getFocusableChild(
        containerRef.current?.querySelector<HTMLElement>(`[data-index="${firstHiddenIndex}"]`) ?? null,
      )
      if (firstHiddenChild) firstHiddenChild.focus()
      else collapseButtonRef.current?.focus()
    })
  }

  const collapseInline = () => {
    flushSync(() => setIsInlineExpanded(false))
    queueMicrotask(() => expandButtonRef.current?.focus())
  }

  const rootOverflow = !isTruncated || (overflowStyle === 'inline' && isInlineExpanded) ? 'inline' : undefined

  return (
    <Component
      {...rest}
      ref={rootRef}
      className={cn(
        'primer:flex primer:max-w-full primer:flex-nowrap primer:gap-1 primer:overflow-hidden primer:leading-none primer:[contain:layout] primer:data-[overflow=inline]:flex-wrap',
        isList && 'primer:m-0 primer:list-none primer:ps-0',
        className,
      )}
      data-component="LabelGroup"
      data-list={isList || undefined}
      data-overflow={rootOverflow}
    >
      {!isList && !isTruncated
        ? children
        : childrenArray.map((child, index) => (
            <ItemWrapper
              ref={node => {
                itemRefs.current[index] = node
              }}
              key={(React.isValidElement(child) && child.key) || index}
              className={cn(isTruncated && itemClassName)}
              data-hidden={index >= childCount - hiddenCount || undefined}
              data-index={isTruncated ? index : undefined}
            >
              {child}
            </ItemWrapper>
          ))}
      {isTruncated ? (
        <ToggleWrapper
          ref={(node: HTMLElement | null) => {
            toggleRef.current = node
          }}
          data-component="LabelGroup.Toggle"
          className="primer:flex primer:shrink-0 primer:items-center"
        >
          {overflowStyle === 'inline' ? (
            isInlineExpanded ? (
              <Button ref={collapseButtonRef} size="small" variant="invisible" onClick={collapseInline}>
                Show less
              </Button>
            ) : hiddenCount ? (
              <Button
                ref={expandButtonRef}
                aria-label={`Show +${hiddenCount} more`}
                size="small"
                variant="invisible"
                onClick={expandInline}
              >
                <span aria-hidden="true">+{hiddenCount}</span>
              </Button>
            ) : null
          ) : hiddenCount ? (
            <AnchoredOverlay modal open={isOverlayOpen} onOpenChange={setIsOverlayOpen}>
              <AnchoredOverlay.Trigger
                render={
                  <Button
                    ref={expandButtonRef}
                    aria-label={`Show +${hiddenCount} more`}
                    size="small"
                    variant="invisible"
                  />
                }
              >
                <span aria-hidden="true">+{hiddenCount}</span>
              </AnchoredOverlay.Trigger>
              <AnchoredOverlay.Content
                aria-label={`All ${childCount} labels`}
                className="primer:min-w-0 primer:p-2"
                role="dialog"
                side="bottom"
                sideOffset={0}
              >
                <div className="primer:flex primer:items-start primer:gap-2">
                  <div className="primer:flex primer:flex-wrap primer:gap-1">{children}</div>
                  <AnchoredOverlay.Close render={<CloseIconButton size="small" />} />
                </div>
              </AnchoredOverlay.Content>
            </AnchoredOverlay>
          ) : null}
        </ToggleWrapper>
      ) : null}
    </Component>
  )
})

LabelGroup.displayName = 'LabelGroup'
