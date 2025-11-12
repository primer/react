import React, {type PropsWithChildren} from 'react'
import {clsx} from 'clsx'
import {KebabHorizontalIcon} from '@primer/octicons-react'

import classes from './ButtonGroup.module.css'
import {IconButton} from '../Button'
import {AnchoredOverlay} from '../AnchoredOverlay'
import {FocusKeys, useFocusZone} from '../hooks/useFocusZone'
import {useResizeObserver} from '../hooks/useResizeObserver'
import {useProvidedRefOrCreate} from '../hooks'
import {useId} from '../hooks/useId'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

type Phase = 'measuring' | 'ready'

const DEFAULT_OVERFLOW_ARIA_LABEL = 'More actions'
const BORDER_OVERLAP_PX = 1

type Layout = {
  visibleCount: number
}

type ItemDescriptor = {
  key: React.Key
  node: React.ReactNode
}

export function calculateVisibleCount({
  itemWidths,
  containerWidth,
  overflowWidth,
}: {
  itemWidths: number[]
  containerWidth: number
  overflowWidth: number
}): number {
  const totalItems = itemWidths.length

  if (totalItems === 0) {
    return 0
  }

  if (containerWidth <= 0) {
    return 0
  }

  if (overflowWidth <= 0) {
    return totalItems
  }

  // Calculate total width if everything were visible without overflow
  const totalWidthWithoutOverflow = itemWidths.reduce((total, width, index) => {
    const overlapAdjustment = index > 0 ? BORDER_OVERLAP_PX : 0
    return total + Math.max(width - overlapAdjustment, 0)
  }, 0)

  if (totalWidthWithoutOverflow <= containerWidth) {
    return totalItems
  }

  let usedWidth = 0
  let visibleCount = 0

  for (let index = 0; index < totalItems; index++) {
    const width = itemWidths[index]
    const contribution = Math.max(width - (index > 0 ? BORDER_OVERLAP_PX : 0), 0)
    const nextUsedWidth = usedWidth + contribution
    const itemsRemaining = totalItems - (index + 1)

    if (itemsRemaining === 0) {
      if (nextUsedWidth <= containerWidth) {
        visibleCount = totalItems
      }
      break
    }

    const overflowContribution = Math.max(overflowWidth - BORDER_OVERLAP_PX, 0)
    if (nextUsedWidth + overflowContribution > containerWidth) {
      visibleCount = index
      break
    }

    usedWidth = nextUsedWidth
    visibleCount = index + 1
  }

  if (visibleCount < 0) {
    visibleCount = 0
  }

  const overflowCount = totalItems - visibleCount
  if (overflowCount === 1) {
    visibleCount = Math.max(visibleCount - 1, 0)
  }

  return visibleCount
}

export type ButtonGroupProps = PropsWithChildren<{
  /** The role of the group */
  role?: string
  /** className passed in for styling */
  className?: string
  /** Accessible label for the overflow trigger */
  overflowAriaLabel?: string
}>

const ButtonGroup = React.forwardRef(function ButtonGroup(props, forwardRef) {
  const {
    as: BaseComponent = 'div',
    children,
    className,
    role,
    overflowAriaLabel = DEFAULT_OVERFLOW_ARIA_LABEL,
    ...rest
  } = props
  const items = React.useMemo<ItemDescriptor[]>(() => {
    return React.Children.toArray(children).map((child, index) => {
      if (React.isValidElement(child) && child.key !== null) {
        return {key: child.key, node: child}
      }

      return {key: index, node: child as React.ReactNode}
    })
  }, [children])

  const hasItems = items.length > 0

  const containerRef = useProvidedRefOrCreate(forwardRef as React.RefObject<HTMLDivElement>)
  const measurementItemRefs = React.useRef<Array<HTMLDivElement | null>>([])
  const overflowMeasurementRef = React.useRef<HTMLDivElement | null>(null)
  const previousWidthRef = React.useRef<number | null>(null)
  const previousItemCountRef = React.useRef<number>(items.length)

  const [phase, setPhase] = React.useState<Phase>(hasItems ? 'measuring' : 'ready')
  const [layout, setLayout] = React.useState<Layout>({visibleCount: items.length})
  const [isOverflowOpen, setOverflowOpen] = React.useState(false)

  React.useEffect(() => {
    if (previousItemCountRef.current !== items.length) {
      previousItemCountRef.current = items.length
      setPhase(items.length > 0 ? 'measuring' : 'ready')
    }
  }, [items.length])

  React.useEffect(() => {
    if (phase === 'measuring') {
      measurementItemRefs.current = []
      overflowMeasurementRef.current = null
    }
  }, [phase])

  React.useLayoutEffect(() => {
    if (phase !== 'measuring') {
      return
    }

    const containerWidth = containerRef.current?.getBoundingClientRect().width ?? 0
    if (containerWidth === 0) {
      return
    }

    const itemWidths = items.map((_, index) => {
      const ref = measurementItemRefs.current[index]
      return ref ? ref.getBoundingClientRect().width : 0
    })

    const overflowWidth = overflowMeasurementRef.current?.getBoundingClientRect().width ?? 0

    if (itemWidths.some(width => width === 0) && items.length > 0) {
      return
    }

    const visibleCount = calculateVisibleCount({
      itemWidths,
      containerWidth,
      overflowWidth,
    })

    setLayout({visibleCount})
    setPhase('ready')
  }, [containerRef, items, phase])

  const scheduleMeasurement = React.useCallback(() => {
    setPhase(current => (current === 'measuring' || !hasItems ? current : 'measuring'))
  }, [hasItems])

  useResizeObserver(entries => {
    const entry = entries[0]
    const width = entry.contentRect.width
    if (previousWidthRef.current === width) {
      return
    }
    previousWidthRef.current = width
    scheduleMeasurement()
  }, containerRef as React.RefObject<HTMLElement>)

  React.useEffect(() => {
    if (layout.visibleCount >= items.length && isOverflowOpen) {
      setOverflowOpen(false)
    }
  }, [isOverflowOpen, items.length, layout.visibleCount])

  useFocusZone({
    containerRef,
    disabled: role !== 'toolbar',
    bindKeys: FocusKeys.ArrowHorizontal,
    focusOutBehavior: 'wrap',
  })

  const overflowMenuId = useId()
  const overflowAriaLabelText = overflowAriaLabel

  const visibleItems = React.useMemo(() => {
    return items.slice(0, layout.visibleCount)
  }, [items, layout.visibleCount])

  const overflowItems = React.useMemo(() => {
    return items.slice(layout.visibleCount)
  }, [items, layout.visibleCount])

  const setMeasurementRef = React.useCallback(
    (index: number) => (node: HTMLDivElement | null) => {
      measurementItemRefs.current[index] = node
    },
    [],
  )

  const renderOverflowTrigger = (measurement: boolean) => {
    const trigger = (
      <IconButton
        icon={KebabHorizontalIcon}
        aria-label={overflowAriaLabelText}
        aria-haspopup="menu"
        aria-expanded={measurement ? undefined : isOverflowOpen}
        variant="invisible"
        size="medium"
      />
    )

    if (measurement) {
      return trigger
    }

    return (
      <AnchoredOverlay
        open={isOverflowOpen}
        onOpen={() => setOverflowOpen(true)}
        onClose={() => setOverflowOpen(false)}
        renderAnchor={anchorProps => (
          <IconButton
            {...anchorProps}
            icon={KebabHorizontalIcon}
            aria-label={overflowAriaLabelText}
            aria-haspopup="menu"
            aria-controls={overflowMenuId}
            aria-expanded={isOverflowOpen}
            variant="invisible"
            size="medium"
          />
        )}
        focusTrapSettings={{disabled: false}}
        focusZoneSettings={{bindKeys: FocusKeys.ArrowVertical, focusOutBehavior: 'wrap'}}
      >
        <div className={classes.OverflowOverlay} id={overflowMenuId} role="menu" aria-label={overflowAriaLabelText}>
          {overflowItems.map(item => (
            <div key={item.key} role="none" className={classes.OverflowItem}>
              {item.node}
            </div>
          ))}
        </div>
      </AnchoredOverlay>
    )
  }

  return (
    <BaseComponent
      ref={containerRef}
      className={clsx(className, classes.ButtonGroup)}
      data-phase={phase}
      role={role}
      {...rest}
    >
      {phase === 'measuring' ? (
        <>
          {items.map((item, index) => (
            <div
              key={item.key}
              ref={setMeasurementRef(index)}
              data-button-group-slot
              className={classes.MeasurementItem}
            >
              {item.node}
            </div>
          ))}
          {hasItems ? (
            <div ref={overflowMeasurementRef} data-button-group-slot data-kind="overflow-trigger">
              {renderOverflowTrigger(true)}
            </div>
          ) : null}
        </>
      ) : (
        <>
          {visibleItems.map(item => (
            <div key={item.key} data-button-group-slot>
              {item.node}
            </div>
          ))}
          {overflowItems.length > 0 ? (
            <div data-button-group-slot data-kind="overflow-trigger">
              {renderOverflowTrigger(false)}
            </div>
          ) : null}
        </>
      )}
    </BaseComponent>
  )
}) as PolymorphicForwardRefComponent<'div', ButtonGroupProps>

ButtonGroup.displayName = 'ButtonGroup'

export default ButtonGroup
