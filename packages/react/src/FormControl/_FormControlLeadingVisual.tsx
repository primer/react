import React from 'react'
import Box from '../Box'
import {get} from '../constants'
import type {SxProp} from '../sx'
import {useFormControlContext} from './_FormControlContext'

const FormControlLeadingVisual: React.FC<React.PropsWithChildren<SxProp>> = ({children, sx}) => {
  const {disabled, captionId} = useFormControlContext()
  return (
    <Box
      color={disabled ? 'fg.muted' : 'fg.default'}
      sx={{
        '> *': {
          minWidth: captionId ? get('fontSizes.4') : get('fontSizes.2'),
          minHeight: captionId ? get('fontSizes.4') : get('fontSizes.2'),
          fill: 'currentColor',
        },
        ...sx,
      }}
      ml={2}
    >
      {children}
    </Box>
  )
}

export default FormControlLeadingVisual
