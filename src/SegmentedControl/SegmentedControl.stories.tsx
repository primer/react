import React, {useState} from 'react'
import {Story, Meta} from '@storybook/react'
import {SegmentedControl} from '.'
import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'
import {Box, Text} from '../'

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

const excludedControlKeys = ['variant']

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
      name: 'fullWidth.narrow',
      control: {
        type: 'boolean'
      }
    },
    fullWidthAtRegular: {
      name: 'fullWidth.regular',
      control: {
        type: 'boolean'
      }
    },
    fullWidthAtWide: {
      name: 'fullWidth.wide',
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
  parameters: {controls: {exclude: excludedControlKeys}}
} as Meta<typeof SegmentedControl>

export const Playground: Story<typeof SegmentedControl> = args => (
  <SegmentedControl
    aria-label="File view"
    fullWidth={parseFullWidthFromArgs(args)}
    variant={parseVariantFromArgs(args)}
    size={args.size}
  >
    <SegmentedControl.Button selected aria-label={'Preview'} leadingIcon={EyeIcon}>
      Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Raw'} leadingIcon={FileCodeIcon}>
      Raw
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Blame'} leadingIcon={PeopleIcon}>
      Blame
    </SegmentedControl.Button>
  </SegmentedControl>
)

export const Default = () => (
  <SegmentedControl aria-label="File view">
    <SegmentedControl.Button selected>Preview</SegmentedControl.Button>
    <SegmentedControl.Button>Raw</SegmentedControl.Button>
    <SegmentedControl.Button>Blame</SegmentedControl.Button>
  </SegmentedControl>
)

export const WithIcons = () => (
  <SegmentedControl aria-label="File view">
    <SegmentedControl.Button selected aria-label={'Preview'} leadingIcon={EyeIcon}>
      Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Raw'} leadingIcon={FileCodeIcon}>
      Raw
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Blame'} leadingIcon={PeopleIcon}>
      Blame
    </SegmentedControl.Button>
  </SegmentedControl>
)

export const Controlled = () => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const handleChange = (i: number) => {
    setSelectedIndex(i)
  }
  return (
    <SegmentedControl aria-label="File view" onChange={handleChange}>
      <SegmentedControl.Button selected={selectedIndex === 0}>Preview</SegmentedControl.Button>
      <SegmentedControl.Button selected={selectedIndex === 1}>Raw</SegmentedControl.Button>
      <SegmentedControl.Button selected={selectedIndex === 2}>Blame</SegmentedControl.Button>
    </SegmentedControl>
  )
}

export const VariantNarrowHideLabels = () => (
  <SegmentedControl aria-label="File view" variant={{narrow: 'hideLabels', regular: 'default', wide: 'default'}}>
    <SegmentedControl.Button selected aria-label={'Preview'} leadingIcon={EyeIcon}>
      Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Raw'} leadingIcon={FileCodeIcon}>
      Raw
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Blame'} leadingIcon={PeopleIcon}>
      Blame
    </SegmentedControl.Button>
  </SegmentedControl>
)
VariantNarrowHideLabels.storyName = '[variant: narrow] Hide labels'

export const VariantNarrowActionMenu = () => (
  <SegmentedControl aria-label="File view" variant={{narrow: 'dropdown', regular: 'default', wide: 'default'}}>
    <SegmentedControl.Button selected aria-label={'Preview'} leadingIcon={EyeIcon}>
      Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Raw'} leadingIcon={FileCodeIcon}>
      Raw
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Blame'} leadingIcon={PeopleIcon}>
      Blame
    </SegmentedControl.Button>
  </SegmentedControl>
)
VariantNarrowActionMenu.storyName = '[variant: narrow] Action menu'

export const FullwidthNarrow = () => (
  <SegmentedControl aria-label="File view" fullWidth={{narrow: true, regular: false, wide: false}}>
    <SegmentedControl.Button selected aria-label={'Preview'} leadingIcon={EyeIcon}>
      Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Raw'} leadingIcon={FileCodeIcon}>
      Raw
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Blame'} leadingIcon={PeopleIcon}>
      Blame
    </SegmentedControl.Button>
  </SegmentedControl>
)
FullwidthNarrow.storyName = '[fullWidth: narrow]'

export const FullwidthRegular = () => (
  <SegmentedControl aria-label="File view" fullWidth={{narrow: false, regular: true, wide: false}}>
    <SegmentedControl.Button selected aria-label={'Preview'} leadingIcon={EyeIcon}>
      Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Raw'} leadingIcon={FileCodeIcon}>
      Raw
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Blame'} leadingIcon={PeopleIcon}>
      Blame
    </SegmentedControl.Button>
  </SegmentedControl>
)
FullwidthRegular.storyName = '[fullWidth: regular]'

export const FullwidthAll = () => (
  <SegmentedControl aria-label="File view" fullWidth>
    <SegmentedControl.Button selected aria-label={'Preview'} leadingIcon={EyeIcon}>
      Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Raw'} leadingIcon={FileCodeIcon}>
      Raw
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Blame'} leadingIcon={PeopleIcon}>
      Blame
    </SegmentedControl.Button>
  </SegmentedControl>
)
FullwidthAll.storyName = 'Full width'

export const IconOnly = () => (
  <SegmentedControl aria-label="File view">
    <SegmentedControl.IconButton selected aria-label={'Preview'} icon={EyeIcon} />
    <SegmentedControl.IconButton aria-label={'Raw'} icon={FileCodeIcon} />
    <SegmentedControl.IconButton aria-label={'Blame'} icon={PeopleIcon} />
  </SegmentedControl>
)
IconOnly.storyName = 'Icon only'

// TODO: make it possible to use FormControl as a wrapper for SegmentedControl
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
AssociatedWithALabelAndCaption.storyName = '[Example] Associated with a label and caption'
