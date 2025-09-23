import React from 'react'
import Truncate from '../Truncate'
import {ItemContext} from './shared'
import classes from './ActionList.module.css'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'
import {clsx} from 'clsx'

export type ActionListDescriptionProps = {
  /**
   * Secondary text style variations.
   *
   * - `"inline"` - Secondary text is positioned beside primary text.
   * - `"block"` - Secondary text is positioned below primary text.
   */
  variant?: 'inline' | 'block'

  className?: string
  /**
   * Whether the inline description should truncate the text on overflow.
   */
  truncate?: boolean
}

export const Description: React.FC<React.PropsWithChildren<ActionListDescriptionProps>> = ({
  variant = 'inline',
  className,
  truncate,
  ...props
}) => {
  const {blockDescriptionId, inlineDescriptionId} = React.useContext(ItemContext)
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

  if (variant === 'block' || !truncate) {
    return (
      <BoxWithFallback
        as="span"
        id={variant === 'block' ? blockDescriptionId : inlineDescriptionId}
        className={clsx(className, classes.Description)}
        data-component="ActionList.Description"
      >
        {props.children}
      </BoxWithFallback>
    )
  } else {
    return (
      <Truncate
        ref={containerRef}
        id={inlineDescriptionId}
        className={clsx(className, classes.Description)}
        title={effectiveTitle}
        inline={true}
        maxWidth="100%"
        data-component="ActionList.Description"
      >
        {props.children}
      </Truncate>
    )
  }
}
