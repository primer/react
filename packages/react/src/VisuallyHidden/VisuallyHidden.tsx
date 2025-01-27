import {clsx} from 'clsx'
import React, {type HTMLAttributes} from 'react'
import classes from './VisuallyHidden.module.css'

export const VisuallyHidden = ({className, children, ...rest}: VisuallyHiddenProps) => {
  return (
    <span className={clsx(className, classes.VisuallyHidden)} {...rest}>
      {children}
    </span>
  )
}

export type VisuallyHiddenProps = React.PropsWithChildren<
  HTMLAttributes<HTMLSpanElement> & {
    className?: string
  }
>
