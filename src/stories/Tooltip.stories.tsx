import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, ThemeProvider, IconButton, Button} from '..'
import Box from '../Box'
import Tooltip from '../Tooltip'
import {SearchIcon} from '@primer/octicons-react'

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

export const IconButtonTooltip = () => (
  <Box sx={{p: 5}}>
    <Tooltip aria-label="Search">
      <IconButton icon={SearchIcon} aria-label="Search" />
    </Tooltip>
  </Box>
)
