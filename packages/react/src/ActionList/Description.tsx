import React from 'react'
import Truncate from '../Truncate'
import type {SxProp} from '../sx'
import {ItemContext} from './shared'
import classes from './ActionList.module.css'
import {defaultSxProp} from '../utils/defaultSxProp'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'
import {clsx} from 'clsx'

type DescriptionVariantTypes =
  | {
      /**
       * Secondary text style variations.
       *
       * - `"block"` - Secondary text is positioned below primary text.
       */
      variant: 'block'
      /**
       * Whether the inline description should truncate the text on overflow.
       */
      truncate?: boolean
      title?: never
    }
  | {
      /**
       * Secondary text style variations.
       *
       * - `"inline"` - Secondary text is positioned beside primary text.
       */
      variant?: 'inline'
      /**
       * Whether the inline description should truncate the text on overflow.
       */
      truncate?: boolean
      /**
       * The title attribute for the truncated text tooltip.
       * If not provided and children is a string, it will be set automatically.
       *
       * `title` should be used sparingly, as it may be inaccessible to some users.
       */
      title?: string
    }

export type ActionListDescriptionProps = DescriptionVariantTypes & {
  className?: string
} & SxProp

export const Description: React.FC<React.PropsWithChildren<ActionListDescriptionProps>> = ({
  variant = 'inline',
  sx = defaultSxProp,
  className,
  truncate,
  title,
  ...props
}) => {
  const {blockDescriptionId, inlineDescriptionId} = React.useContext(ItemContext)
  const effectiveTitle = title || (typeof props.children === 'string' ? props.children : '')

  if (variant === 'block' || !truncate) {
    return (
      <BoxWithFallback
        as="span"
        sx={sx}
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
        id={inlineDescriptionId}
        className={clsx(className, classes.Description)}
        sx={sx}
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
