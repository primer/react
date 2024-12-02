import React from 'react'
import type {Meta} from '@storybook/react'
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

export const WithSx = () => (
  <SegmentedControl aria-label="File view" sx={{fontFamily: 'monospace'}}>
    <SegmentedControl.Button defaultSelected aria-label={'Preview'} leadingIcon={EyeIcon} sx={{color: 'success.fg'}}>
      Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Raw'} leadingIcon={FileCodeIcon} sx={{color: 'success.fg'}}>
      Raw
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Blame'} leadingIcon={PeopleIcon} sx={{color: 'success.fg'}}>
      Blame
    </SegmentedControl.Button>
  </SegmentedControl>
)

export const WithSxAndCss = () => (
  <SegmentedControl aria-label="File view" sx={{fontFamily: 'monospace'}} className="testCustomClassnameMono">
    <SegmentedControl.Button
      defaultSelected
      aria-label={'Preview'}
      leadingIcon={EyeIcon}
      sx={{color: 'success.fg'}}
      className="testCustomClassnameColor"
    >
      Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button
      aria-label={'Raw'}
      leadingIcon={FileCodeIcon}
      sx={{color: 'success.fg'}}
      className="testCustomClassnameColor"
    >
      Raw
    </SegmentedControl.Button>
    <SegmentedControl.Button
      aria-label={'Blame'}
      leadingIcon={PeopleIcon}
      sx={{color: 'success.fg'}}
      className="testCustomClassnameColor"
    >
      Blame
    </SegmentedControl.Button>
  </SegmentedControl>
)
