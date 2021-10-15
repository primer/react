/**
 * show item dividers
 */

import React from 'react'
import Box from '../Box'
import {SxProp} from '../sx'
import {Header, HeaderProps} from './Header'

export type GroupProps = HeaderProps & SxProp

export function Group({title, variant, auxiliaryText, sx = {}, ...props}: GroupProps): JSX.Element {
  return (
    <Box
      sx={{
        '&:not(:first-child)': {marginTop: 2},
        ...sx
      }}
      {...props}
    >
      {title && <Header title={title} variant={variant} auxiliaryText={auxiliaryText} />}
      {props.children}
    </Box>
  )
}
