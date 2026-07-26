import type {Meta, StoryObj} from '@storybook/react-vite'
import {
  AlertIcon,
  CheckCircleIcon,
  HeartIcon,
  InfoIcon,
  LockIcon,
  RocketIcon,
  StarIcon,
  XCircleIcon,
} from '@primer/octicons-react'
import {InlineMessage, type InlineMessageProps} from './InlineMessage'

const iconMap = {
  default: undefined,
  InfoIcon,
  LockIcon,
  RocketIcon,
  AlertIcon,
  CheckCircleIcon,
  XCircleIcon,
  HeartIcon,
  StarIcon,
} as const

const meta = {
  title: 'React Tailwind/Content/InlineMessage',
  component: InlineMessage,
} satisfies Meta<typeof InlineMessage>
export default meta

type Story = StoryObj<typeof meta>
type PlaygroundArgs = Omit<InlineMessageProps, 'leadingVisual'> & {
  leadingVisual?: keyof typeof iconMap
}
export const Default: Story = {
  args: {children: 'An example inline message', variant: 'unavailable'},
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    size: 'medium',
    variant: 'success',
    leadingVisual: 'default',
  },
  argTypes: {
    size: {control: 'radio', options: ['small', 'medium']},
    variant: {control: 'radio', options: ['critical', 'success', 'unavailable', 'warning']},
    leadingVisual: {
      control: 'select',
      description: 'Select a custom icon to override the default variant icon',
      options: Object.keys(iconMap),
    },
  },
  render: ({leadingVisual: leadingVisualOption, ...args}) => (
    <InlineMessage {...args} leadingVisual={leadingVisualOption ? iconMap[leadingVisualOption] : undefined}>
      An example inline message
    </InlineMessage>
  ),
}
