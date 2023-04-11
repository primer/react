import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, ThemeProvider, Button} from '..'
import {Tooltip} from '../Tooltip'
import Box from '../Box'

export default {
  title: 'Components/Tooltip',
  component: Tooltip,

  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    },
  ],
} as Meta

// As a label for an IconButton
export const Default = () => (
  <Box sx={{p: 5}}>
    <Tooltip aria-label="Filter vegetarian options" direction="e">
      <Button>🥦</Button>
    </Tooltip>
  </Box>
)
