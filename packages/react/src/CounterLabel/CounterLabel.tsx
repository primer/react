import {clsx} from 'clsx'
import type {HTMLAttributes} from 'react'
import type React from 'react'
import {forwardRef} from 'react'
import {VisuallyHidden} from '../VisuallyHidden'
import classes from './CounterLabel.module.css'

export type CounterLabelProps = React.PropsWithChildren<
  HTMLAttributes<HTMLSpanElement> & {
    scheme?: 'primary' | 'secondary'
    className?: string
  }
>

const CounterLabel = forwardRef<HTMLSpanElement, CounterLabelProps>(
  ({scheme = 'secondary', className, children, ...rest}, forwardedRef) => {
    const label = <VisuallyHidden>&nbsp;({children})</VisuallyHidden>
    const counterProps = {
      ref: forwardedRef,
      ['aria-hidden']: 'true' as const,
      ['data-scheme']: scheme,
      ...rest,
    }

    return (
      <>
        <span {...counterProps} className={clsx(className, classes.CounterLabel)}>
          {children}
        </span>
        {label}
      </>
    )
  },
)

CounterLabel.displayName = 'CounterLabel'

// @ts-ignore -- TS doesn't know about the __SLOT__ property
CounterLabel.__SLOT__ = Symbol('CounterLabel')

export default CounterLabel
