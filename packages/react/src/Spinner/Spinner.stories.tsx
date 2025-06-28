import type {Meta, StoryFn} from '@storybook/react-vite'
import Spinner from './Spinner'

export default {
  title: 'Components/Spinner',
  component: Spinner,
} as Meta<typeof Spinner>

export const Default = () => <Spinner />

export const Playground: StoryFn<typeof Spinner> = args => <Spinner {...args} />

Playground.args = {
  size: 'medium',
}

Playground.argTypes = {
  size: {
    control: {
      type: 'radio',
    },
    options: ['small', 'medium', 'large'],
  },
}
