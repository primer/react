import {BoldIcon, ChevronDownIcon} from '@primer/octicons-react'
import React from 'react'
import {IconButton} from '.'
import Box from '../Box'
import {Stack} from '../Stack'

export default {
  title: 'Components/IconButton/Dev',
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

export const IconButtonWithinFlexContainer = () => (
  <Stack direction="horizontal">
    <span>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </span>

    <IconButton icon={BoldIcon} aria-label="Icon button" />
  </Stack>
)
