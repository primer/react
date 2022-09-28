import React from 'react'
import Box from '../Box'
import {get} from '../constants'
import {SxProp} from '../sx'
import {FormControlContext} from './FormControl'
import {Slot} from './slots'

const FormControlLeadingVisual: React.FC<React.PropsWithChildren<SxProp>> = ({children, sx}) => (
  <Slot name="LeadingVisual">
    {({disabled, captionId}: FormControlContext) => (
      <Box
        color={disabled ? 'fg.muted' : 'fg.default'}
        sx={{
          '> *': {
            minWidth: captionId ? get('fontSizes.4') : get('fontSizes.2'),
            minHeight: captionId ? get('fontSizes.4') : get('fontSizes.2'),
            fill: 'currentColor'
          },
          ...sx
        }}
        ml={2}
      >
        {children}
      </Box>
    )}
  </Slot>
)

export default FormControlLeadingVisual
