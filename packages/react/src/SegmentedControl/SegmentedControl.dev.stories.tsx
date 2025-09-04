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

export const WithAriaDisabled = () => {
  const handleOnClick = () => {
    alert('Button clicked!')
  }

  return (
    <SegmentedControl aria-label="File view" className="testCustomClassnameMono">
      <SegmentedControl.IconButton
        onClick={handleOnClick}
        aria-label={'Preview'}
        aria-disabled={true}
        icon={EyeIcon}
        className="testCustomClassnameColor"
      >
        Preview
      </SegmentedControl.IconButton>
      <SegmentedControl.IconButton
        aria-disabled={true}
        onClick={handleOnClick}
        aria-label={'Raw'}
        icon={FileCodeIcon}
        className="testCustomClassnameColor"
      >
        Raw
      </SegmentedControl.IconButton>
      <SegmentedControl.IconButton
        aria-disabled={true}
        onClick={handleOnClick}
        aria-label={'Blame'}
        icon={PeopleIcon}
        className="testCustomClassnameColor"
      >
        Blame
      </SegmentedControl.IconButton>
    </SegmentedControl>
  )
}

export const WithDisabled = () => {
  const handleOnClick = () => {
    alert('Button clicked!')
  }

  return (
    <SegmentedControl aria-label="File view" className="testCustomClassnameMono">
      <SegmentedControl.IconButton
        onClick={handleOnClick}
        aria-label={'Preview'}
        disabled={true}
        icon={EyeIcon}
        className="testCustomClassnameColor"
      >
        Preview
      </SegmentedControl.IconButton>
      <SegmentedControl.IconButton
        disabled={true}
        onClick={handleOnClick}
        aria-label={'Raw'}
        icon={FileCodeIcon}
        className="testCustomClassnameColor"
      >
        Raw
      </SegmentedControl.IconButton>
      <SegmentedControl.IconButton
        disabled={true}
        onClick={handleOnClick}
        aria-label={'Blame'}
        icon={PeopleIcon}
        className="testCustomClassnameColor"
      >
        Blame
      </SegmentedControl.IconButton>
    </SegmentedControl>
  )
}

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
