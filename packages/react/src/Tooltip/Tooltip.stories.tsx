import React from 'react'
import type {Meta} from '@storybook/react'
import {BaseStyles, ThemeProvider, Button} from '..'
import Box from '../Box'
import Tooltip from './Tooltip'

/* Tooltip v1 */

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

export const Default = () => (
  <Box sx={{p: 5}}>
    <Tooltip aria-label="Hello, Tooltip!">
      <Button>Hover me</Button>
    </Tooltip>
  </Box>
)
