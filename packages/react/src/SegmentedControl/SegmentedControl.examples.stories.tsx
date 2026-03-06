import type {Meta} from '@storybook/react-vite'
import {SegmentedControl} from '.'
import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'

export default {
  title: 'Components/SegmentedControl/Examples',
  component: SegmentedControl,
} as Meta<typeof SegmentedControl>

export const WithDisabledButtons = () => (
  <SegmentedControl aria-label="File view">
    <SegmentedControl.Button defaultSelected aria-label={'Preview'} leadingIcon={EyeIcon} disabled>
      Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Raw'} leadingIcon={FileCodeIcon}>
      Raw
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Blame'} leadingIcon={PeopleIcon} aria-disabled={true}>
      Blame
    </SegmentedControl.Button>
  </SegmentedControl>
)
