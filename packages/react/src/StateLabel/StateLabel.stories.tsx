import type {Meta, StoryFn} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import StateLabel from './StateLabel'

export default {
  title: 'Components/StateLabel',
  component: StateLabel,
} as Meta<ComponentProps<typeof StateLabel>>

export const Default = () => <StateLabel status="issueOpened">Open</StateLabel>

export const Playground: StoryFn<ComponentProps<typeof StateLabel>> = args => <StateLabel {...args}>Label</StateLabel>

Playground.args = {
  status: 'issueOpened',
}

Playground.argTypes = {
  ref: {
    controls: false,
    table: {
      disable: true,
    },
  },
  theme: {
    controls: false,
    table: {
      disable: true,
    },
  },
}
