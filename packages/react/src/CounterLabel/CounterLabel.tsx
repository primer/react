import {clsx} from 'clsx'
import type {HTMLAttributes} from 'react'
import type React from 'react'
import {forwardRef} from 'react'
import type {SxProp} from '../sx'
import {VisuallyHidden} from '../VisuallyHidden'
import classes from './CounterLabel.module.css'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'

export type CounterLabelProps = React.PropsWithChildren<
  HTMLAttributes<HTMLSpanElement> & {
    scheme?: 'primary' | 'secondary'
    className?: string
  } & SxProp
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
        <BoxWithFallback as="span" {...counterProps} className={clsx(className, classes.CounterLabel)}>
          {children}
        </BoxWithFallback>
        {label}
      </>
    )
  },
)

CounterLabel.displayName = 'CounterLabel'

export default CounterLabel
