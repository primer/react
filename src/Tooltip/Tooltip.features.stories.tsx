import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, ThemeProvider, IconButton, Button} from '..'
import {Tooltip} from '.'
import {SearchIcon} from '@primer/octicons-react'
import Box from '../Box'

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

// As a label for an IconButton
export const TooltipLabelTypeTooltip = () => (
  <Box sx={{p: 5}}>
    <Tooltip aria-label="Filter vegetarian options" direction="e">
      <Button>🥦</Button>
    </Tooltip>
  </Box>
)

// As a label for an IconButton
export const TooltipNativeHTMLButton = () => (
  <Box sx={{p: 5}}>
    <Tooltip aria-label="Filter vegetarian options" direction="e">
      <button>🥦</button>
    </Tooltip>
  </Box>
)

// As a supplementary description for a button
export const TooltipDescriptionTypeTooltip = () => (
  <Box sx={{p: 5}}>
    <Tooltip text="Supplementary text" type="description">
      <Button>Save</Button>
    </Tooltip>
  </Box>
)

// As a supplementary description for an IconButton
export const TooltipIconButtonWithDescription = () => (
  <Box sx={{p: 5}}>
    <Tooltip text="Supplementary text" type="description">
      <IconButton icon={SearchIcon} aria-label="Search" />
    </Tooltip>
  </Box>
)

export const TooltipWithDirection = () => (
  <Box sx={{padding: 5, display: 'flex', gap: '8px'}}>
    <Tooltip direction="n" text="Supplementary text" type="description">
      <Button>North</Button>
    </Tooltip>
    <Tooltip direction="s" text="Supplementary text" type="description">
      <Button>South</Button>
    </Tooltip>
    <Tooltip direction="e" text="Supplementary text" type="description">
      <Button>East</Button>
    </Tooltip>
    <Tooltip direction="w" text="Supplementary text" type="description">
      <Button>West</Button>
    </Tooltip>
    <Tooltip direction="ne" text="Supplementary text" type="description">
      <Button>North East</Button>
    </Tooltip>
    <Tooltip direction="nw" text="Supplementary text" type="description">
      <Button>North West</Button>
    </Tooltip>
    <Tooltip direction="se" text="Supplementary text" type="description">
      <Button>Southeast</Button>
    </Tooltip>
    <Tooltip direction="sw" text="Supplementary text" type="description">
      <Button>Southwest</Button>
    </Tooltip>
    <Tooltip
      direction="n"
      wrap
      text="Random long text that needs to be wrapped and be multipline and have some paddings around"
      type="description"
    >
      <Button>Multiline</Button>
    </Tooltip>
  </Box>
)

export const TooltipNoDelay = () => (
  <Tooltip noDelay text="Supplemetary text" type="description" direction="se">
    <Button>Button</Button>
  </Tooltip>
)

export const TooltipWithAlign = () => (
  <Box sx={{padding: 5, display: 'flex', gap: '8px'}}>
    <Tooltip align="left" text="Supplemetary text" type="description">
      <Button>Align Left</Button>
    </Tooltip>
    <Tooltip align="right" text="Supplemetary text" type="description">
      <Button>Align Right</Button>
    </Tooltip>
  </Box>
)

export const TooltipWithWrap = () => (
  <Box sx={{padding: 5, display: 'flex', gap: '8px'}}>
    <Tooltip
      direction="e"
      wrap
      text="Random long text that needs to be wrapped and be multipline and have some paddings around"
      type="description"
    >
      <Button>Multiline East</Button>
    </Tooltip>
    <Tooltip
      direction="se"
      wrap
      text="Random long text that needs to be wrapped and be multipline and have some paddings around"
      type="description"
    >
      <Button>Multiline Southeast</Button>
    </Tooltip>
  </Box>
)
