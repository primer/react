import React from 'react'
import Truncate from '../Truncate'
import {ItemContext} from './shared'
import classes from './ActionList.module.css'
import {clsx} from 'clsx'
import type {FCWithSlotMarker} from '../utils/types/Slots'
import {useResizeObserver} from '../hooks/useResizeObserver'

export type ActionListDescriptionProps = {
  /**
   * Secondary text style variations.
   *
   * - `"inline"` - Secondary text is positioned beside primary text.
   * - `"block"` - Secondary text is positioned below primary text.
   */
  variant?: 'inline' | 'block'

  className?: string
  style?: React.CSSProperties
  /**
   * Whether the inline description should truncate the text on overflow.
   */
  truncate?: boolean
}

export const Description: FCWithSlotMarker<React.PropsWithChildren<ActionListDescriptionProps>> = ({
  variant = 'inline',
  className,
  truncate,
  style,
  ...props
}) => {
  const {blockDescriptionId, inlineDescriptionId, setTruncatedText} = React.useContext(ItemContext)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [computedTitle, setComputedTitle] = React.useState<string>('')

  // Extract text content from rendered DOM for tooltip
  React.useEffect(() => {
    if (truncate && containerRef.current) {
      const textContent = containerRef.current.textContent || ''
      setComputedTitle(textContent)
    }
  }, [truncate, props.children])

  const effectiveTitle = typeof props.children === 'string' ? props.children : computedTitle

  // Detect truncation and signal to parent Item for Tooltip
  const truncateEnabled = truncate && !!setTruncatedText
  useResizeObserver(
    () => {
      const el = containerRef.current
      if (!el || !setTruncatedText) return
      setTruncatedText(el.scrollWidth > el.clientWidth ? effectiveTitle : undefined)
    },
    containerRef,
    [truncateEnabled, effectiveTitle],
  )

  // check on initial render
  React.useEffect(() => {
    if (!truncateEnabled || !containerRef.current) return
    const el = containerRef.current
    setTruncatedText(el.scrollWidth > el.clientWidth ? effectiveTitle : undefined)

    return () => {
      setTruncatedText(undefined)
    }
  }, [truncateEnabled, effectiveTitle, setTruncatedText])

  if (variant === 'block' || !truncate) {
    return (
      <span
        id={variant === 'block' ? blockDescriptionId : inlineDescriptionId}
        className={clsx(className, classes.Description)}
        style={style}
        data-component="ActionList.Description"
      >
        {props.children}
      </span>
    )
  } else {
    return (
      <Truncate
        ref={containerRef}
        id={inlineDescriptionId}
        className={clsx(className, classes.Description)}
        style={style}
        title={setTruncatedText ? '' : effectiveTitle}
        inline={true}
        maxWidth="100%"
        data-component="ActionList.Description"
      >
        {props.children}
      </Truncate>
    )
  }
}

Description.__SLOT__ = Symbol('ActionList.Description')
