import type {Meta, StoryFn} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import ToggleSwitch from './ToggleSwitch'
import {Text} from '..'
import ToggleSwitchStoryWrapper from './ToggleSwitchStoryWrapper'
import classes from './ToggleSwitch.stories.module.css'

export default {
  title: 'Components/ToggleSwitch',
  component: ToggleSwitch,
  decorators: [
    Story => {
      return <ToggleSwitchStoryWrapper>{Story()}</ToggleSwitchStoryWrapper>
    },
  ],
} as Meta<ComponentProps<typeof ToggleSwitch>>

export const Playground: StoryFn<typeof ToggleSwitch> = args => (
  <>
    <Text id="toggle" className={classes.TextLargeBold}>
      Toggle label
    </Text>
    <ToggleSwitch {...args} aria-labelledby="toggle" />
  </>
)

Playground.args = {
  checked: undefined,
  disabled: false,
  loading: false,
  size: 'medium',
}
Playground.argTypes = {
  checked: {
    control: {
      type: 'boolean',
    },
  },
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  loading: {
    control: {
      type: 'boolean',
    },
  },
  size: {
    control: {
      type: 'radio',
    },
    options: ['small', 'medium'],
  },
}

export const Default = () => (
  <>
    <Text id="toggle" className={classes.TextMediumBold}>
      Toggle label
    </Text>
    <ToggleSwitch aria-labelledby="toggle" />
  </>
)
