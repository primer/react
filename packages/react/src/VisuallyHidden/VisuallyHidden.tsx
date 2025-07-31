import type {SxProp} from '../sx'
import {clsx} from 'clsx'
import type React from 'react'
import {type HTMLAttributes} from 'react'
import classes from './VisuallyHidden.module.css'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'

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
export const VisuallyHidden = ({className, children, ...rest}: VisuallyHiddenProps) => {
  return (
    <BoxWithFallback as="span" className={clsx(className, classes.VisuallyHidden)} {...rest}>
      {children}
    </BoxWithFallback>
  )
}

export type VisuallyHiddenProps = React.PropsWithChildren<
  HTMLAttributes<HTMLSpanElement> & {
    className?: string
  } & SxProp
>
