import React from 'react'
import {Button, Box} from '../..'
import {Tooltip} from './Tooltip'

export default {
  title: 'Drafts/Components/Tooltip',
  component: Tooltip,
}

// Description type, north direction by default
export const Default = () => (
  <Box sx={{p: 6}}>
    <Tooltip text="This change can't be undone.">
      <Button>Delete</Button>
    </Tooltip>
  </Box>
)
