import React from 'react'
import {Button, Box} from '../..'
import {Tooltip} from './Tooltip'

export default {
  title: 'Components/Experimental/Tooltip',
  component: Tooltip,
}

// As a label for an IconButton
export const Default = () => (
  <Box sx={{p: 5}}>
    <Tooltip aria-label="This change will be applied in the organisational level">
      <Button>👍</Button>
    </Tooltip>
  </Box>
)
