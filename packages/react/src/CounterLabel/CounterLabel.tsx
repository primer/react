import React, {HTMLAttributes, forwardRef} from 'react'
import Box from '../Box'
import {BetterSystemStyleObject, SxProp, merge} from '../sx'
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
              color: scheme === 'primary' ? 'fg.onEmphasis' : 'fg.default',
              '&:empty': {
                display: 'none',
              },
            },
            sx,
          )}
          {...props}
          as="span"
          // @ts-expect-error Box is expecting a divelement, but this component forces a span element
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
