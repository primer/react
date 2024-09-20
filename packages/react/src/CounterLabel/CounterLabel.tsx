import {clsx} from 'clsx'
import type {HTMLAttributes} from 'react'
import React, {forwardRef} from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import sx from '../sx'
import type {SxProp} from '../sx'
import {VisuallyHidden} from '../internal/components/VisuallyHidden'
import {defaultSxProp} from '../utils/defaultSxProp'
import {useFeatureFlag} from '../FeatureFlags'
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
    const enabled = useFeatureFlag('primer_react_css_modules_team')
    const label = <VisuallyHidden>&nbsp;({children})</VisuallyHidden>
    const counterProps = {
      ref: forwardedRef,
      ['aria-hidden']: 'true' as const,
      ['data-scheme']: scheme,
      ...rest,
    }

    if (enabled) {
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
    }

    return (
      <>
        <StyledCounterLabel {...counterProps} className={className} sx={sx}>
          {children}
        </StyledCounterLabel>
        {label}
      </>
    )
  },
)

const StyledCounterLabel = styled.span`
  display: inline-block;
  padding: 2px 5px;
  font-size: 12px;
  font-weight: bold;
  line-height: 1;
  border-radius: 20px;
  border: var(--borderWidth-thin, max(1px, 0.0625rem)) solid var(--counter-borderColor, var(--color-counter-border));

  &[data-scheme='primary'] {
    background-color: ${get('colors.neutral.emphasis')};
    color: ${get('colors.fg.onEmphasis')};
  }

  &[data-scheme='secondary'] {
    background-color: ${get('colors.neutral.muted')};
    color: ${get('colors.fg.default')};
  }

  &:empty {
    display: none;
  }

  ${sx}
`

CounterLabel.displayName = 'CounterLabel'

export default CounterLabel
