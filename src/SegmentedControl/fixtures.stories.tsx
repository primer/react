import React from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Box, Text, ThemeProvider} from '../'
import {SegmentedControl} from '.'

export default {
  title: 'SegmentedControl/fixtures',
  component: SegmentedControl,
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ]
} as Meta

// TODO: make it possible to use FormControl
// - FormControl.Label needs to accept `id` prop
// - FormControl.Label needs to accept a prop that lets it render an element that isn't a `<label>`
export const AssociatedWithALabelAndCaption = () => (
  <Box display="flex">
    <Box flexGrow={1}>
      <Text fontSize={2} fontWeight="bold" id="scLabel-vert" display="block">
        File view
      </Text>
      <Text color="fg.subtle" fontSize={1} id="scCaption-vert" display="block">
        Change the way the file is viewed
      </Text>
    </Box>
    <SegmentedControl aria-labelledby="scLabel-vert" aria-describedby="scCaption-vert">
      <SegmentedControl.Button selected>Preview</SegmentedControl.Button>
      <SegmentedControl.Button>Raw</SegmentedControl.Button>
      <SegmentedControl.Button>Blame</SegmentedControl.Button>
    </SegmentedControl>
  </Box>
)

export const FullWidth = () => (
  <SegmentedControl aria-label="File view" fullWidth>
    <SegmentedControl.Button selected>Preview</SegmentedControl.Button>
    <SegmentedControl.Button>Raw</SegmentedControl.Button>
    <SegmentedControl.Button>Blame</SegmentedControl.Button>
  </SegmentedControl>
)
