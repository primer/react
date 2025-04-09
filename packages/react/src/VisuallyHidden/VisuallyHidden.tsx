import type {SxProp} from '../sx'
import {clsx} from 'clsx'
import React, {type HTMLAttributes} from 'react'
import classes from './VisuallyHidden.module.css'
import {defaultSxProp} from '../utils/defaultSxProp'
import Box from '../Box'

/**
 * Provides a component that implements the "visually hidden" technique. This is
 * analagous to the common `sr-only` class. Children that are rendered inside
 * this component will not be visible but will be available to screen readers.
 *
 * Note: if this component, or a descendant, has focus then this component will
 * no longer be visually hidden.
 *
 * @see https://www.scottohara.me/blog/2023/03/21/visually-hidden-hack.html
 */
export const VisuallyHidden = ({className, children, sx: sxProp = defaultSxProp, ...rest}: VisuallyHiddenProps) => {
  if (sxProp !== defaultSxProp) {
    return (
      <Box sx={sxProp} className={clsx(className, classes.VisuallyHidden)} {...rest}>
        {children}
      </Box>
    )
  }

  return (
    <span className={clsx(className, classes.VisuallyHidden)} {...rest}>
      {children}
    </span>
  )
}

export type VisuallyHiddenProps = React.PropsWithChildren<
  HTMLAttributes<HTMLSpanElement> & {
    className?: string
  } & SxProp
>
