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
    <Tooltip2 text="Supplementary text" type="description">
      <Button>Save</Button>
    </Tooltip2>
  </Box>
)

// As a supplementary description for an IconButton
export const Tooltip2IconButtonWithDescription = () => (
  <Box sx={{p: 5}}>
    <Tooltip2 text="Supplementary text" type="description">
      <IconButton icon={SearchIcon} aria-label="Search" />
    </Tooltip2>
  </Box>
)

// As a supplementary description for a button
export const MultipleChildren = () => (
  <Box sx={{p: 5}}>
    <Tooltip2 text="Supplementary text" type="description">
      <Button>Save</Button>
      <Button>Cancel</Button>
    </Tooltip2>
  </Box>
)

export const WithDirection = () => (
  <Box sx={{padding: 5, display: 'flex', gap: '8px'}}>
    <Tooltip2 direction="n" text="Supplementary text" type="description">
      <Button>North</Button>
    </Tooltip2>
    <Tooltip2 direction="s" text="Supplementary text" type="description">
      <Button>South</Button>
    </Tooltip2>
    <Tooltip2 direction="e" text="Supplementary text" type="description">
      <Button>East</Button>
    </Tooltip2>
    <Tooltip2 direction="w" text="Supplementary text" type="description">
      <Button>West</Button>
    </Tooltip2>
    <Tooltip2 direction="ne" text="Supplementary text" type="description">
      <Button>North East</Button>
    </Tooltip2>
    <Tooltip2 direction="nw" text="Supplementary text" type="description">
      <Button>North West</Button>
    </Tooltip2>
    <Tooltip2 direction="se" text="Supplementary text" type="description">
      <Button>Southeast</Button>
    </Tooltip2>
    <Tooltip2 direction="sw" text="Supplementary text" type="description">
      <Button>Southwest</Button>
    </Tooltip2>
  </Box>
)
