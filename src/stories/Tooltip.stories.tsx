import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, ThemeProvider, IconButton, Button} from '..'
import Tooltip from '../Tooltip'
import Tooltip2 from '../Tooltip2'
import {SearchIcon} from '@primer/octicons-react'
import Box from '../Box'

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

export const CurrentTooltip = () => (
  <Box sx={{p: 5}}>
    <Tooltip text="Search">
      <IconButton icon={SearchIcon} aria-label="Search" />
    </Tooltip>
  </Box>
)

// As a label for an IconButton
export const Tooltip2LabelTypeTooltip = () => (
  <Box sx={{p: 5}}>
    <Tooltip2>
      <IconButton icon={SearchIcon} aria-label="Search" />
    </Tooltip2>
  </Box>
)

// As a supplementary description for a button
export const Tooltip2DescriptionTypeTooltip = () => (
  <Box sx={{p: 5}}>
    <Tooltip2 text="This is a supplementary text" type="description">
      <Button>Save</Button>
    </Tooltip2>
  </Box>
)

// As a supplementary description for an IconButton
export const Tooltip2IconButtonWithDescription = () => (
  <Box sx={{p: 5}}>
    <Tooltip2 text="This is a supplementary text" type="description">
      <IconButton icon={SearchIcon} aria-label="Search" />
    </Tooltip2>
  </Box>
)

// As a supplementary description for a button
export const MultipleChildren = () => (
  <Box sx={{p: 5}}>
    <Tooltip2 text="This is a supplementary text" type="description">
      <span>one button</span>
    </Tooltip2>
  </Box>
)
