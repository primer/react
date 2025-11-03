import type {Meta, StoryObj} from '@storybook/react-vite'
import {InlineMessage} from '../InlineMessage'

const meta = {
  title: 'Experimental/Components/InlineMessage',
  component: InlineMessage,
} satisfies Meta<typeof InlineMessage>

export default meta

export const Default = () => {
  return <InlineMessage variant="unavailable">An example inline message</InlineMessage>
}

export const Playground: StoryObj<typeof InlineMessage> = {
  render(args) {
    return <InlineMessage {...args}>An example inline message</InlineMessage>
  },
  argTypes: {
    size: {
      controls: {
        type: 'radio',
      },
      options: ['small', 'medium'],
    },
    variant: {
      controls: {
        type: 'radio',
      },
      options: ['critical', 'success', 'unavailable', 'warning'],
    },
  },
  args: {
    size: 'medium',
    variant: 'success',
  },
}
