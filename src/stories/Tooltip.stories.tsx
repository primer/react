import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, ThemeProvider, IconButton} from '..'
import Box from '../Box'
import Tooltip from '../Tooltip'
import {SearchIcon} from '@primer/octicons-react'
import {Placeholder} from '../Placeholder'

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

export const TextTooltip = () => (
  <Box borderWidth="1px" borderStyle="solid" borderColor="border.default" borderRadius={2} p={3}>
    <Tooltip aria-label="Hello, Tooltip!">Text with a tooltip</Tooltip>
  </Box>
)

export const IconButtonTooltip = () => (
  <Box sx={{p: 5}}>
    <Tooltip aria-label="Search">
      <IconButton icon={SearchIcon} aria-label="Search" />
    </Tooltip>
  </Box>
)

export const TooltipWithAncestor = () => (
  <div className="App">
    <Box>
      <Box
        sx={{
          background: '#a8a8a8',
          zIndex: 1,
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
          zIndex: 0,
        }}
      >
        <Box
          sx={{
            p: 1,
            position: 'sticky',
            top: 82,
            // because content is position: relative, we need to set a higher z-index on this header
            zIndex: 1,
            background: 'cornflowerblue',
          }}
        >
          <Tooltip aria-label="Tooltip currently falls behind the top sticky header">
            Second sticky header, Text with a tooltip, within a stacking context
          </Tooltip>
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
