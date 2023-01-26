import React, {useState} from 'react'
import {Meta} from '@storybook/react'
import {SegmentedControl} from '.'
import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'
import {Box, Text} from '../'

export default {
  title: 'Components/SegmentedControl/Features',
  component: SegmentedControl,
} as Meta<typeof SegmentedControl>

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

export const VariantNarrowHideLabels = {
  render: () => (
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
  ),

  name: '[variant: narrow] Hide labels',
}

export const VariantNarrowActionMenu = {
  render: () => (
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
  ),

  name: '[variant: narrow] Action menu',
}

export const FullwidthNarrow = {
  render: () => (
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
  ),

  name: '[fullWidth: narrow]',
}

export const FullwidthRegular = {
  render: () => (
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
  ),

  name: '[fullWidth: regular]',
}

export const FullwidthAll = {
  render: () => (
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
  ),

  name: 'Full width',
}

export const IconOnly = {
  render: () => (
    <SegmentedControl aria-label="File view">
      <SegmentedControl.IconButton selected aria-label={'Preview'} icon={EyeIcon} />
      <SegmentedControl.IconButton aria-label={'Raw'} icon={FileCodeIcon} />
      <SegmentedControl.IconButton aria-label={'Blame'} icon={PeopleIcon} />
    </SegmentedControl>
  ),

  name: 'Icon only',
}

export const AssociatedWithALabelAndCaption = {
  render: () => (
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
  ),

  name: '[Example] Associated with a label and caption',
}
