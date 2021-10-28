import React from 'react'
import Box from '../Box'
import {SxProp} from '../sx'
import {Header, HeaderProps} from './Header'

export type GroupProps = HeaderProps & SxProp

export const Group: React.FC<GroupProps> = ({title, variant, auxiliaryText, sx = {}, ...props}) => {
  return (
    <Box
      as="li"
      sx={{
        '&:not(:first-child)': {marginTop: 2},
        ...sx
      }}
      {...props}
    >
      {title && <Header title={title} variant={variant} auxiliaryText={auxiliaryText} />}
      <Box as="ul" sx={{paddingInlineStart: 0}}>
        {props.children}
      </Box>
    </Box>
  )
}
