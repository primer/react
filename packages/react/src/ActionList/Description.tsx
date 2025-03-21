import React from 'react'
import Box from '../Box'
import Truncate from '../Truncate'
import type {SxProp} from '../sx'
import {ItemContext} from './shared'
import classes from './ActionList.module.css'
import {clsx} from 'clsx'
import {defaultSxProp} from '../utils/defaultSxProp'

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
} & SxProp

export const Description: React.FC<React.PropsWithChildren<ActionListDescriptionProps>> = ({
  variant = 'inline',
  sx = defaultSxProp,
  className,
  truncate,
  ...props
}) => {
  const {blockDescriptionId, inlineDescriptionId} = React.useContext(ItemContext)

  if (sx !== defaultSxProp) {
    if (variant === 'block' || !truncate) {
      return (
        <Box
          as="span"
          sx={sx as SxProp}
          id={variant === 'block' ? blockDescriptionId : inlineDescriptionId}
          className={className}
          data-component="ActionList.Description"
        >
          {props.children}
        </Box>
      )
    } else {
      return (
        <Truncate
          id={inlineDescriptionId}
          className={className}
          sx={sx as SxProp}
          title={props.children as string}
          inline={true}
          maxWidth="100%"
          data-component="ActionList.Description"
        >
          {props.children}
        </Truncate>
      )
    }
  }
  if (variant === 'block' || !truncate) {
    return (
      <span
        className={clsx(className, classes.Description)}
        data-component="ActionList.Description"
        id={variant === 'block' ? blockDescriptionId : inlineDescriptionId}
      >
        {props.children}
      </span>
    )
  } else {
    return (
      <Truncate
        id={inlineDescriptionId}
        className={clsx(className, classes.Description)}
        title={props.children as string}
        inline={true}
        maxWidth="100%"
        data-component="ActionList.Description"
        data-truncate={truncate}
      >
        {props.children}
      </Truncate>
    )
  }
}
