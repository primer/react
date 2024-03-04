import type {HTMLAttributes} from 'react'
import React, {forwardRef} from 'react'
import Box from '../Box'
import type {BetterSystemStyleObject, SxProp} from '../sx'
import {merge} from '../sx'
import VisuallyHidden from '../_VisuallyHidden'
import {defaultSxProp} from '../utils/defaultSxProp'

export type CounterLabelProps = React.PropsWithChildren<
  HTMLAttributes<HTMLSpanElement> & {
    scheme?: 'primary' | 'secondary'
  } & SxProp
>

const CounterLabel = forwardRef<HTMLSpanElement, CounterLabelProps>(
  ({scheme = 'secondary', sx = defaultSxProp, children, ...props}, forwardedRef) => {
    return (
      <>
        <Box
          aria-hidden="true"
          sx={merge<BetterSystemStyleObject>(
            {
              display: 'inline-block',
              padding: '2px 5px',
              fontSize: 0,
              fontWeight: 'bold',
              lineHeight: 'condensedUltra',
              borderRadius: '20px',
              backgroundColor: scheme === 'primary' ? 'neutral.emphasis' : 'neutral.muted',
              border:
                'var(--borderWidth-thin,max(1px, 0.0625rem)) solid var(--counter-borderColor,var(--color-counter-border))',
              color: scheme === 'primary' ? 'fg.onEmphasis' : 'fg.default',
              '&:empty': {
                display: 'none',
              },
            },
            sx,
          )}
          {...props}
          as="span"
          ref={forwardedRef}
        >
          {children}
        </Box>
        <VisuallyHidden>&nbsp;({children})</VisuallyHidden>
      </>
    )
  },
)

CounterLabel.displayName = 'CounterLabel'

export default CounterLabel
