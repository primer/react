import type {Meta, StoryFn} from '@storybook/react-vite'
import {useState} from 'react'
import {SegmentedControl} from '.'
import SegmentedControlIconButton from './SegmentedControlIconButton'
import SegmentedControlButton from './SegmentedControlButton'
import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'
import classes from './SegmentedControl.dev.stories.module.css'
import TextInput from '../TextInput'

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
      leadingVisual={EyeIcon}
      className="testCustomClassnameColor"
    >
      Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Raw'} leadingVisual={FileCodeIcon} className="testCustomClassnameColor">
      Raw
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Blame'} leadingVisual={PeopleIcon} className="testCustomClassnameColor">
      Blame
    </SegmentedControl.Button>
  </SegmentedControl>
)

type ConstrainedControlsArgs = {
  size: 'small' | 'medium'
  appearance: 'default' | 'subtle'
  fullWidthMode: 'omitted' | 'explicit-false'
  textContent: 'plain' | 'unequal-labels-with-visuals'
}

export const ConstrainedControls: StoryFn<ConstrainedControlsArgs> = ({
  size,
  appearance,
  fullWidthMode,
  textContent,
}) => {
  const props = {size, variant: appearance, fullWidth: fullWidthMode === 'explicit-false' ? false : undefined}
  const withVisuals = textContent === 'unequal-labels-with-visuals'

  return (
    <div className={classes.ConstrainedControls}>
      <div>
        <SegmentedControl {...props} aria-label="Text file view">
          <SegmentedControl.Button
            defaultSelected
            leadingVisual={withVisuals ? EyeIcon : undefined}
            count={withVisuals ? 5 : undefined}
          >
            {withVisuals ? 'Preview changes before publishing '.repeat(8) : 'Preview changes before publishing'}
          </SegmentedControl.Button>
          <SegmentedControl.Button>Code</SegmentedControl.Button>
          <SegmentedControl.Button
            leadingVisual={withVisuals ? PeopleIcon : undefined}
            count={withVisuals ? 2 : undefined}
          >
            Blame
          </SegmentedControl.Button>
        </SegmentedControl>
      </div>
      <div>
        <SegmentedControl {...props} aria-label="Mixed file view">
          <SegmentedControl.Button defaultSelected>Preview changes</SegmentedControl.Button>
          <SegmentedControl.IconButton aria-label="Code" icon={FileCodeIcon} />
          <SegmentedControl.IconButton aria-label="Blame" icon={PeopleIcon} />
        </SegmentedControl>
      </div>
      <div>
        <SegmentedControl {...props} aria-label="Icon file view">
          <SegmentedControl.IconButton defaultSelected aria-label="Preview" icon={EyeIcon} />
          <SegmentedControl.IconButton aria-label="Code" icon={FileCodeIcon} />
          <SegmentedControl.IconButton aria-label="Blame" icon={PeopleIcon} />
        </SegmentedControl>
      </div>
    </div>
  )
}

ConstrainedControls.args = {size: 'medium', appearance: 'default', fullWidthMode: 'omitted', textContent: 'plain'}

ConstrainedControls.argTypes = {
  size: {control: 'radio', options: ['small', 'medium']},
  appearance: {control: 'radio', options: ['default', 'subtle']},
  fullWidthMode: {control: 'radio', options: ['omitted', 'explicit-false']},
  textContent: {control: 'radio', options: ['plain', 'unequal-labels-with-visuals']},
}

export const ChangingLabel = () => {
  const [label, setLabel] = useState('Preview changes before publishing')
  const [disabled, setDisabled] = useState(false)
  const [focusEvents, setFocusEvents] = useState(0)
  const [mouseOverEvents, setMouseOverEvents] = useState(0)
  const [mouseEnterEvents, setMouseEnterEvents] = useState(0)

  return (
    <div className={classes.ConstrainedControls}>
      <TextInput aria-label="Segment label" value={label} onChange={event => setLabel(event.target.value)} />
      <label>
        <input type="checkbox" checked={disabled} onChange={event => setDisabled(event.target.checked)} />
        Disable first segment
      </label>
      <p id="changing-label-description">Choose a file view</p>
      <div className={classes.ChangingLabelControl}>
        <SegmentedControl aria-label="File view">
          <SegmentedControl.Button
            defaultSelected
            leadingVisual={EyeIcon}
            count={5}
            disabled={disabled}
            aria-describedby="changing-label-description"
            onFocus={() => setFocusEvents(value => value + 1)}
            onMouseOverCapture={() => setMouseOverEvents(value => value + 1)}
            onMouseEnter={() => setMouseEnterEvents(value => value + 1)}
          >
            {label}
          </SegmentedControl.Button>
          <SegmentedControl.Button>Code</SegmentedControl.Button>
          <SegmentedControl.Button>Blame</SegmentedControl.Button>
        </SegmentedControl>
      </div>
      <output aria-label="Focus events">{focusEvents}</output>
      <output aria-label="Mouse-over events">{mouseOverEvents}</output>
      <output aria-label="Mouse-enter events">{mouseEnterEvents}</output>
    </div>
  )
}
