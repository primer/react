import React from 'react'
import {Box} from '..'
import {get} from '../constants'
import {SxProp} from '../sx'
import {Slot} from './slots'
import {FormControlContext} from './_FormControlContext'

const FormControlLeadingVisual: React.FC<React.PropsWithChildren<SxProp>> = ({children, sx}) => {
  const {disabled, captionId} = React.useContext(FormControlContext) ?? {}

  return (
    <Slot name="LeadingVisual">
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
    </Slot>
  )
}

export default FormControlLeadingVisual
