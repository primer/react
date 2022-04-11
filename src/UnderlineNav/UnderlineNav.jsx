import React from 'react'
import Box from '../Box'
import {merge} from '../sx'

export const UnderlineNav = ({as = 'nav', align, sx: sxProp = {}, children}) => {
  const justifyContent = align === 'right' ? 'right' : 'space-between'
  const styles = {
    display: 'flex',
    justifyContent,
    boxShadow: 'inset 0 -1px 0',
    boxShadowColor: 'fg.muted'
  }
  const ulStyles = {
    display: 'flex',
    listStyle: 'none',
    padding: '0',
    margin: '0'
  }
  return (
    <Box as={as} sx={merge(styles, sxProp)}>
      <Box as="ul" sx={ulStyles}>
        {children}
      </Box>
    </Box>
  )
}
