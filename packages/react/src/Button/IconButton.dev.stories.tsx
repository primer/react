import {ChevronDownIcon} from '@primer/octicons-react'
import React from 'react'
import {IconButton} from '.'

export default {
  title: 'Components/IconButton/DevOnly',
}

export const CustomSize = () => (
  <IconButton aria-label="Expand" variant="primary" size="small" icon={ChevronDownIcon} sx={{width: 16, height: 16}} />
)

export const CustomSizeWithMedia = () => {
  return (
    <IconButton
      aria-label="Expand"
      variant="primary"
      size="small"
      icon={ChevronDownIcon}
      sx={{'@media (min-width: 123px)': {width: 16, height: 16}}}
    />
  )
}

export const CustomIconColor = () => (
  <IconButton aria-label="Expand" variant="invisible" size="small" icon={ChevronDownIcon} sx={{color: 'red'}} />
)
