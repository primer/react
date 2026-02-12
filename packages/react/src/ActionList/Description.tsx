import React from 'react'
import Truncate from '../Truncate'
import {ItemContext} from './shared'
import classes from './ActionList.module.css'
import {clsx} from 'clsx'
import type {FCWithSlotMarker} from '../utils/types/Slots'

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
  React.useEffect(() => {
    if (!truncate || !containerRef.current || !setTruncatedText) return

    function isContentTruncated() {
      const el = containerRef.current
      if (!el) return false
      return el.scrollWidth > el.clientWidth
    }

    // Check initially
    setTruncatedText(isContentTruncated() ? effectiveTitle : undefined)

    const observer = new ResizeObserver(() => {
      setTruncatedText(isContentTruncated() ? effectiveTitle : undefined)
    })
    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [truncate, effectiveTitle, setTruncatedText])

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
