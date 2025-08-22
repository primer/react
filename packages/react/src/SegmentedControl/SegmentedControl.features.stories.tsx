import {useState} from 'react'
import type {Meta} from '@storybook/react-vite'
import {SegmentedControl} from '.'
import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'
import {Text} from '..'
import classes from './SegmentedControl.features.stories.module.css'

export default {
  title: 'Components/SegmentedControl/Features',
  component: SegmentedControl,
} as Meta<typeof SegmentedControl>

export const WithIcons = () => (
  <SegmentedControl aria-label="File view">
    <SegmentedControl.Button defaultSelected aria-label={'Preview'} leadingIcon={EyeIcon}>
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
    <SegmentedControl.Button defaultSelected aria-label={'Preview'} leadingIcon={EyeIcon}>
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
    <SegmentedControl.Button defaultSelected aria-label={'Preview'} leadingIcon={EyeIcon}>
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
    <SegmentedControl.Button defaultSelected aria-label={'Preview'} leadingIcon={EyeIcon}>
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
    <SegmentedControl.Button defaultSelected aria-label={'Preview'} leadingIcon={EyeIcon}>
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
    <SegmentedControl.Button defaultSelected aria-label={'Preview'} leadingIcon={EyeIcon}>
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
    <SegmentedControl.IconButton defaultSelected aria-label={'Preview'} icon={EyeIcon} />
    <SegmentedControl.IconButton aria-label={'Raw'} icon={FileCodeIcon} />
    <SegmentedControl.IconButton aria-label={'Blame'} icon={PeopleIcon} />
  </SegmentedControl>
)
IconOnly.storyName = 'Icon only'

export const AssociatedWithALabelAndCaption = () => (
  <div className={classes.LabelAndCaptionContainer}>
    <div className={classes.LabelAndCaption}>
      <Text fontSize={2} fontWeight="bold" id="scLabel-vert" display="block">
        File view
      </Text>
      <Text color="fg.subtle" fontSize={1} id="scCaption-vert" display="block">
        Change the way the file is viewed
      </Text>
    </div>
    <SegmentedControl aria-labelledby="scLabel-vert" aria-describedby="scCaption-vert">
      <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
      <SegmentedControl.Button>Raw</SegmentedControl.Button>
      <SegmentedControl.Button>Blame</SegmentedControl.Button>
    </SegmentedControl>
  </div>
)
AssociatedWithALabelAndCaption.storyName = '[Example] Associated with a label and caption'
