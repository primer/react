import type {StoryFn, Meta, StoryObj} from '@storybook/react-vite'
import CounterLabel from './CounterLabel'

export default {
  title: 'Components/CounterLabel',
  component: CounterLabel,
} as Meta<typeof CounterLabel>

export const Default: StoryFn<typeof CounterLabel> = () => <CounterLabel>12</CounterLabel>

export const Playground: StoryObj<typeof CounterLabel> = {
  render: args => <CounterLabel {...args}>12</CounterLabel>,
  args: {
    scheme: 'primary',
  },
  argTypes: {
    scheme: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
  },
}
