import {clsx} from 'clsx'
import type {HTMLAttributes} from 'react'
import type React from 'react'
import {forwardRef} from 'react'
import {VisuallyHidden} from '../VisuallyHidden'
import classes from './CounterLabel.module.css'

export type CounterLabelProps = React.PropsWithChildren<
  HTMLAttributes<HTMLSpanElement> & {
    /** @deprecated use variant instead */
    scheme?: 'primary' | 'secondary'
    variant?: 'primary' | 'secondary'
    className?: string
  }
>

const CounterLabel = forwardRef<HTMLSpanElement, CounterLabelProps>(
  ({variant, scheme, className, children, ...rest}, forwardedRef) => {
    const label = <VisuallyHidden>&nbsp;({children})</VisuallyHidden>

    const inferredVariant = variant || scheme || 'secondary'

    const counterProps = {
      ref: forwardedRef,
      ['aria-hidden']: 'true' as const,
      ['data-variant']: inferredVariant,
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

export default CounterLabel
