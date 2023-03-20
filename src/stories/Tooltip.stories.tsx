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

// As a label for an IconButton
export const Tooltip2CustomIcon = () => (
  <Box sx={{p: 5}}>
    <Tooltip2 text="Label">
      <button>🥦</button>
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

export const CurrentTooltipVariations = () => (
  <Box>
    <Box sx={{padding: 5, display: 'flex', gap: '8px'}}>
      <Tooltip direction="n" text="Supplementary text">
        <Button>North</Button>
      </Tooltip>
      <Tooltip direction="s" text="Supplementary text">
        <Button>South</Button>
      </Tooltip>
      <Tooltip direction="e" text="Supplementary text">
        <Button>East</Button>
      </Tooltip>
      <Tooltip direction="w" text="Supplementary text">
        <Button>West</Button>
      </Tooltip>
      <Tooltip direction="ne" text="Supplementary text">
        <Button>North East</Button>
      </Tooltip>
      <Tooltip direction="nw" text="Supplementary text">
        <Button>North West</Button>
      </Tooltip>
      <Tooltip direction="se" text="Supplementary text">
        <Button>Southeast</Button>
      </Tooltip>
      <Tooltip direction="sw" text="Supplementary text">
        <Button>Southwest</Button>
      </Tooltip>
    </Box>
    <Box sx={{padding: 5, display: 'flex', gap: '8px'}}>
      <Tooltip
        direction="e"
        wrap
        text="Random long text that needs to be wrapped and be multipline and have some paddings around"
      >
        <Button>Multiline e</Button>
      </Tooltip>
      <Tooltip
        direction="sw"
        wrap
        text="Random long text that needs to be wrapped and be multipline and have some paddings around"
      >
        <Button>Multiline sw</Button>
      </Tooltip>
      {/* Align left seems to be broken */}
      <Tooltip align="left" text="Supplemetary text">
        <Button>Align Left</Button>
      </Tooltip>
      <Tooltip align="right" text="Supplemetary text">
        <Button>Align Right</Button>
      </Tooltip>
    </Box>
  </Box>
)

export const Tooltip2WithDirection = () => (
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
    <Tooltip2
      direction="n"
      wrap
      text="Random long text that needs to be wrapped and be multipline and have some paddings around"
      type="description"
    >
      <Button>Multiline</Button>
    </Tooltip2>
  </Box>
)

export const Tooltip2WithAlign = () => (
  <Box sx={{padding: 5, display: 'flex', gap: '8px'}}>
    <Tooltip2 align="left" text="Supplemetary text" type="description">
      <Button>Align Left</Button>
    </Tooltip2>
    <Tooltip2 align="right" text="Supplemetary text" type="description">
      <Button>Align Right</Button>
    </Tooltip2>
  </Box>
)

export const Tooltip2WithWrap = () => (
  <Box sx={{padding: 5, display: 'flex', gap: '8px'}}>
    <Tooltip2
      direction="e"
      wrap
      text="Random long text that needs to be wrapped and be multipline and have some paddings around"
      type="description"
    >
      <Button>Multiline e</Button>
    </Tooltip2>
    <Tooltip2
      direction="se"
      wrap
      text="Random long text that needs to be wrapped and be multipline and have some paddings around"
      type="description"
    >
      <Button>Multiline se</Button>
    </Tooltip2>
  </Box>
)
