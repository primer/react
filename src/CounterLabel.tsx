import React from 'react'
import Box from './Box'
import {BetterSystemStyleObject, SxProp, merge} from './sx'
import VisuallyHidden from './_VisuallyHidden'

export type CounterLabelProps = {
  scheme?: 'primary' | 'secondary'
} & SxProp

const CounterLabel: React.FC<React.PropsWithChildren<CounterLabelProps>> = ({
  scheme = 'secondary',
  sx = {},
  children,
  ...props
}) => {
  return (
    <>
      <Box
        as="span"
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
              display: 'none'
            }
          },
          sx
        )}
        {...props}
      >
        {children}
      </Box>
      <VisuallyHidden>&nbsp;{`(${children})`}</VisuallyHidden>
    </>
  )
}

CounterLabel.displayName = 'CounterLabel'

export default CounterLabel
