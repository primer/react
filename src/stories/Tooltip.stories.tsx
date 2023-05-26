import {SearchIcon} from '@primer/octicons-react'
import {Meta} from '@storybook/react'
import React from 'react'
import {BaseStyles, IconButton, ThemeProvider} from '..'
import Box from '../Box'
import Tooltip from '../Tooltip'

export default {
  title: 'Components/Tooltip/Default',
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

export const IconButtonTooltip = () => (
  <Box sx={{p: 5}}>
    <Tooltip aria-label="Search">
      <IconButton icon={SearchIcon} aria-label="Search" />
    </Tooltip>
  </Box>
)
