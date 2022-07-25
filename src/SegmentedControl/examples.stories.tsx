import React, {useState} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, ThemeProvider} from '..'
import {SegmentedControl} from '.'
import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'
import Box from '../Box'

type ResponsiveVariantOptions = 'dropdown' | 'hideLabels' | 'default'
type Args = {
  fullWidth?: boolean
  variantAtNarrow: ResponsiveVariantOptions
  variantAtNarrowLandscape: ResponsiveVariantOptions
  variantAtRegular: ResponsiveVariantOptions
  variantAtWide: ResponsiveVariantOptions
  variantAtPortrait: ResponsiveVariantOptions
  variantAtLandscape: ResponsiveVariantOptions
}

const excludedControlKeys = [
  'aria-label',
  'onChange',
  'sx',
  'variant',
  'aria-label',
  'aria-labelledby',
  'aria-describedby'
]

const variantOptions = ['dropdown', 'hideLabels', 'default']

const parseVarientFromArgs = (args: Args) => {
  const {
    variantAtNarrow,
    variantAtNarrowLandscape,
    variantAtRegular,
    variantAtWide,
    variantAtPortrait,
    variantAtLandscape
  } = args
  return {
    narrow: variantAtNarrow,
    narrowLandscape: variantAtNarrowLandscape,
    regular: variantAtRegular,
    wide: variantAtWide,
    portrait: variantAtPortrait,
    landscape: variantAtLandscape
  }
}

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
    variantAtNarrow: {
      name: 'variant.narrow',
      defaultValue: 'default',
      control: {
        type: 'radio',
        options: variantOptions
      }
    },
    variantAtNarrowLandscape: {
      name: 'variant.narrowLandscape',
      defaultValue: 'default',
      control: {
        type: 'radio',
        options: variantOptions
      }
    },
    variantAtRegular: {
      name: 'variant.regular',
      defaultValue: 'default',
      control: {
        type: 'radio',
        options: variantOptions
      }
    },
    variantAtWide: {
      name: 'variant.wide',
      defaultValue: 'default',
      control: {
        type: 'radio',
        options: variantOptions
      }
    },
    variantAtPortrait: {
      name: 'variant.portrait',
      defaultValue: 'default',
      control: {
        type: 'radio',
        options: variantOptions
      }
    },
    variantAtLandscape: {
      name: 'variant.Landscape',
      defaultValue: 'default',
      control: {
        type: 'radio',
        options: variantOptions
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
  <SegmentedControl aria-label="File view" {...args} variant={parseVarientFromArgs(args)}>
    <SegmentedControl.Button selected>Preview</SegmentedControl.Button>
    <SegmentedControl.Button>Raw</SegmentedControl.Button>
    <SegmentedControl.Button>Blame</SegmentedControl.Button>
  </SegmentedControl>
)

export const Controlled = (args: Args) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const handleChange = (i: number) => {
    setSelectedIndex(i)
  }

  return (
    <SegmentedControl aria-label="File view" onChange={handleChange} {...args} variant={parseVarientFromArgs(args)}>
      <SegmentedControl.Button selected={selectedIndex === 0}>Preview</SegmentedControl.Button>
      <SegmentedControl.Button selected={selectedIndex === 1}>Raw</SegmentedControl.Button>
      <SegmentedControl.Button selected={selectedIndex === 2}>Blame</SegmentedControl.Button>
    </SegmentedControl>
  )
}

export const WithIconsAndLabels = (args: Args) => (
  // padding needed to show Tooltip
  // there is a separate initiative to change Tooltip to get positioned with useAnchoredPosition
  <Box pt={5}>
    <SegmentedControl aria-label="File view" {...args} variant={parseVarientFromArgs(args)}>
      <SegmentedControl.Button selected leadingIcon={EyeIcon}>
        Preview
      </SegmentedControl.Button>
      <SegmentedControl.Button leadingIcon={FileCodeIcon}>Raw</SegmentedControl.Button>
      <SegmentedControl.Button leadingIcon={PeopleIcon}>Blame</SegmentedControl.Button>
    </SegmentedControl>
  </Box>
)

export const IconsOnly = (args: Args) => (
  // padding needed to show Tooltip
  // there is a separate initiative to change Tooltip to get positioned with useAnchoredPosition
  <Box pt={5}>
    <SegmentedControl aria-label="File view" {...args} variant={parseVarientFromArgs(args)}>
      <SegmentedControl.IconButton selected icon={EyeIcon} aria-label="Preview" />
      <SegmentedControl.IconButton icon={FileCodeIcon} aria-label="Raw" />
      <SegmentedControl.IconButton icon={PeopleIcon} aria-label="Blame" />
    </SegmentedControl>
  </Box>
)
