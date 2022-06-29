import React, {useState} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, ThemeProvider} from '..'
import {ComponentProps} from '../utils/types'
import {SegmentedControl} from '.'
import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'

type Args = ComponentProps<typeof SegmentedControl>

const excludedControlKeys = ['aria-label', 'onChange', 'sx']

export default {
  title: 'SegmentedControl/examples',
  component: SegmentedControl,
  argTypes: {
    fullWidth: {
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    },
    loading: {
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    }
  },
  parameters: {controls: {exclude: excludedControlKeys}},
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

export const Default = (args: Args) => (
  <SegmentedControl aria-label="File view" {...args}>
    <SegmentedControl.Button selected>Preview</SegmentedControl.Button>
    <SegmentedControl.Button>Raw</SegmentedControl.Button>
    <SegmentedControl.Button>Blame</SegmentedControl.Button>
  </SegmentedControl>
)

export const Controlled = (args: Args) => {
  const [selectedIndex, setSelectedIndex] = useState(1)
  const handleChange = (i: number) => {
    setSelectedIndex(i)
  }

  return (
    <SegmentedControl aria-label="File view" onChange={handleChange} {...args}>
      <SegmentedControl.Button selected={selectedIndex === 0}>Preview</SegmentedControl.Button>
      <SegmentedControl.Button selected={selectedIndex === 1}>Raw</SegmentedControl.Button>
      <SegmentedControl.Button selected={selectedIndex === 2}>Blame</SegmentedControl.Button>
    </SegmentedControl>
  )
}

export const WithIconsAndLabels = (args: Args) => (
  <SegmentedControl aria-label="File view" {...args}>
    <SegmentedControl.Button selected leadingIcon={EyeIcon}>
      Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button leadingIcon={FileCodeIcon}>Raw</SegmentedControl.Button>
    <SegmentedControl.Button leadingIcon={PeopleIcon}>Blame</SegmentedControl.Button>
  </SegmentedControl>
)

export const IconsOnly = (args: Args) => (
  <SegmentedControl aria-label="File view" {...args}>
    <SegmentedControl.IconButton selected icon={EyeIcon} aria-label="Preview" />
    <SegmentedControl.IconButton icon={FileCodeIcon} aria-label="Raw" />
    <SegmentedControl.IconButton icon={PeopleIcon} aria-label="Blame" />
  </SegmentedControl>
)
