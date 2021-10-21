import React, {ReactNode} from 'react'
import Box from '../Box'
import {SxProp} from '../sx'

const Visual = ({children, sx}: {children: ReactNode} & SxProp) => {
  return <Box sx={{display: 'inline-block', ...sx}}>{children}</Box>
}

export default Visual
