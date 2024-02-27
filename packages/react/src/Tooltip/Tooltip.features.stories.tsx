import React from 'react'
import type {Meta} from '@storybook/react'
import {BaseStyles, ThemeProvider, IconButton} from '..'
import Box from '../Box'
import Tooltip from './Tooltip'
import {SearchIcon} from '@primer/octicons-react'

/* Tooltip v1 */

export default {
  title: 'Components/Tooltip/Features',
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
