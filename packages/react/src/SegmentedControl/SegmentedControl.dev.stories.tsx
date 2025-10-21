import type {Meta} from '@storybook/react-vite'
import {SegmentedControl} from '.'
import SegmentedControlIconButton from './SegmentedControlIconButton'
import SegmentedControlButton from './SegmentedControlButton'
import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'

const excludedControlKeys = ['variant']

export default {
  title: 'Components/SegmentedControl/Dev',
  component: SegmentedControl,
  subcomponents: {SegmentedControlButton, SegmentedControlIconButton},
  parameters: {controls: {exclude: excludedControlKeys}},
} as Meta<typeof SegmentedControl>

export const WithCss = () => (
  <SegmentedControl aria-label="File view" className="testCustomClassnameMono">
    <SegmentedControl.Button
      defaultSelected
      aria-label={'Preview'}
      leadingIcon={EyeIcon}
      className="testCustomClassnameColor"
    >
      Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Raw'} leadingIcon={FileCodeIcon} className="testCustomClassnameColor">
      Raw
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Blame'} leadingIcon={PeopleIcon} className="testCustomClassnameColor">
      Blame
    </SegmentedControl.Button>
  </SegmentedControl>
)

export const InNarrowContainer = () => (
  <div style={{width: '275px', border: '1px solid black', padding: '8px'}}>
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
  </div>
)
