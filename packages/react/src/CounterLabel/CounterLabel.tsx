import {clsx} from 'clsx'
import type {HTMLAttributes} from 'react'
import React, {forwardRef} from 'react'
import type {SxProp} from '../sx'
import {VisuallyHidden} from '../VisuallyHidden'
import {defaultSxProp} from '../utils/defaultSxProp'
import Box from '../Box'
import classes from './CounterLabel.module.css'

export type CounterLabelProps = React.PropsWithChildren<
  HTMLAttributes<HTMLSpanElement> & {
    scheme?: 'primary' | 'secondary'
    className?: string
  } & SxProp
>

const CounterLabel = forwardRef<HTMLSpanElement, CounterLabelProps>(
  ({scheme = 'secondary', sx = defaultSxProp, className, children, ...rest}, forwardedRef) => {
    const label = <VisuallyHidden>&nbsp;({children})</VisuallyHidden>
    const counterProps = {
      ref: forwardedRef,
      ['aria-hidden']: 'true' as const,
      ['data-scheme']: scheme,
      ...rest,
    }

    if (sx !== defaultSxProp) {
      return (
        <>
          <Box as="span" {...counterProps} className={clsx(className, classes.CounterLabel)} sx={sx}>
            {children}
          </Box>
          {label}
        </>
      )
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
