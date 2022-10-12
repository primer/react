import React, {useState} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, ThemeProvider} from '..'
import {SegmentedControl} from '.'
import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'
import Box from '../Box'

type ResponsiveVariantOptions = 'dropdown' | 'hideLabels' | 'default'
type Args = {
  fullWidth?: boolean
  fullWidthAtNarrow?: boolean
  fullWidthAtRegular?: boolean
  fullWidthAtWide?: boolean
  size?: 'small' | 'medium'
  variantAtNarrow: ResponsiveVariantOptions
  variantAtRegular: ResponsiveVariantOptions
  variantAtWide: ResponsiveVariantOptions
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

const parseVariantFromArgs = ({variantAtNarrow, variantAtRegular, variantAtWide}: Args) => ({
  narrow: variantAtNarrow,
  regular: variantAtRegular,
  wide: variantAtWide
})

const parseFullWidthFromArgs = ({fullWidth, fullWidthAtNarrow, fullWidthAtRegular, fullWidthAtWide}: Args) =>
  fullWidth
    ? fullWidth
    : {
        narrow: fullWidthAtNarrow,
        regular: fullWidthAtRegular,
        wide: fullWidthAtWide
      }

export default {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  args: {
    fullWidth: false,
    fullWidthAtNarrow: false,
    fullWidthAtRegular: false,
    fullWidthAtWide: false,
    size: 'medium',
    variantAtNarrow: 'default',
    variantAtRegular: 'default',
    variantAtWide: 'defualt'
  },
  argTypes: {
    fullWidth: {
      control: {
        type: 'boolean'
      }
    },
    fullWidthAtNarrow: {
      control: {
        type: 'boolean'
      }
    },
    fullWidthAtRegular: {
      control: {
        type: 'boolean'
      }
    },
    fullWidthAtWide: {
      control: {
        type: 'boolean'
      }
    },
    size: {
      control: {
        type: 'radio'
      },
      options: ['small', 'medium']
    },
    variantAtNarrow: {
      name: 'variant.narrow',
      control: {
        type: 'radio'
      },
      options: variantOptions
    },
    variantAtRegular: {
      name: 'variant.regular',
      control: {
        type: 'radio'
      },
      options: variantOptions
    },
    variantAtWide: {
      name: 'variant.wide',
      control: {
        type: 'radio'
      },
      options: variantOptions
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
  <SegmentedControl
    aria-label="File view"
    fullWidth={parseFullWidthFromArgs(args)}
    variant={parseVariantFromArgs(args)}
    size={args.size}
  >
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
    <SegmentedControl
      aria-label="File view"
      onChange={handleChange}
      fullWidth={parseFullWidthFromArgs(args)}
      variant={parseVariantFromArgs(args)}
      size={args.size}
    >
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
    <SegmentedControl
      aria-label="File view"
      fullWidth={parseFullWidthFromArgs(args)}
      variant={parseVariantFromArgs(args)}
      size={args.size}
    >
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
    <SegmentedControl
      aria-label="File view"
      fullWidth={parseFullWidthFromArgs(args)}
      variant={parseVariantFromArgs(args)}
      size={args.size}
    >
      <SegmentedControl.IconButton selected icon={EyeIcon} aria-label="Preview" />
      <SegmentedControl.IconButton icon={FileCodeIcon} aria-label="Raw" />
      <SegmentedControl.IconButton icon={PeopleIcon} aria-label="Blame" />
    </SegmentedControl>
  </Box>
)
