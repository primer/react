import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, ThemeProvider, IconButton} from '..'
import Box from '../Box'
import Tooltip from '../Tooltip'
import TooltipPopover from '../TooltipPopover'
import {SearchIcon} from '@primer/octicons-react'

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
    <TooltipPopover aria-label="Tooltip content.">
      <IconButton icon={SearchIcon} aria-label="Search" />
    </TooltipPopover>
  </Box>
)

export const TooltipExample = () => (
  <Box sx={{p: 5}}>
    <TooltipPopover aria-label="Search for something lorem ipsum" direction="e">
      <button>What if the button is really long??</button>
    </TooltipPopover>
  </Box>
)

export const TooltipWithAncestor = () => (
  <div className="App">
    <Box>
      <Box
        sx={{
          background: '#a8a8a8',
          position: 'sticky',
          top: 0,
          p: 4,
        }}
      >
        This is a sticky header
      </Box>
      <Box
        sx={{
          p: 3,
          // this creates a new "stacking context" so that this whole content section falls behind the main sticky header
          position: 'relative',
        }}
      >
        <Box
          sx={{
            p: 1,
            position: 'sticky',
            top: 82,
            background: 'cornflowerblue',
          }}
        >
          <TooltipPopover aria-label="Tooltip currently falls behind the top sticky header">
            Second sticky header, Text with a tooltip, within a stacking context
          </TooltipPopover>
        </Box>
        <Box
          sx={{
            height: 500,
            // having content that is position: relative can change stacking order with sticky headers
            position: 'relative',
          }}
        >
          Content goes here, falls behind the sticky headers
        </Box>
      </Box>
    </Box>
    <Box sx={{height: 1000}}>Extra padding that pushes the sticky header up</Box>
  </div>
)
