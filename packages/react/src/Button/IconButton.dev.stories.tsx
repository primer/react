import {BoldIcon, ChevronDownIcon} from '@primer/octicons-react'
import React from 'react'
import {IconButton} from '.'
import Box from '../Box'

export default {
  title: 'Components/IconButton/DevOnly',
}

export const CustomSize = () => (
  <IconButton aria-label="Expand" variant="primary" size="small" icon={ChevronDownIcon} sx={{width: 24, height: 24}} />
)

export const CustomSizeWithMedia = () => {
  return (
    <IconButton
      aria-label="Expand"
      variant="primary"
      size="small"
      icon={ChevronDownIcon}
      sx={{'@media (min-width: 123px)': {width: 24, height: 24}}}
    />
  )
}

export const CustomIconColor = () => (
  <IconButton aria-label="Expand" variant="invisible" size="small" icon={ChevronDownIcon} sx={{color: 'red'}} />
)

export const CustomSizeWithStyleProp = () => (
  <Box sx={{border: '1px solid', borderColor: 'border.default', display: 'inline-block'}}>
    <IconButton
      icon={BoldIcon}
      aria-label="Bold"
      size="large"
      variant="invisible"
      style={{width: '20px', height: '28px'}}
    />
  </Box>
)
