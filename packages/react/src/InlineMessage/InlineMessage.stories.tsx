import type {Meta, StoryObj} from '@storybook/react-vite'
import {
  AlertIcon,
  CheckCircleIcon,
  InfoIcon,
  LockIcon,
  RocketIcon,
  XCircleIcon,
  HeartIcon,
  StarIcon,
} from '@primer/octicons-react'
import {InlineMessage} from '../InlineMessage'

const meta = {
  title: 'Experimental/Components/InlineMessage',
  component: InlineMessage,
} satisfies Meta<typeof InlineMessage>

export default meta

export const Default = () => {
  return <InlineMessage variant="unavailable">An example inline message</InlineMessage>
}

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

export const Playground: StoryObj<typeof InlineMessage> = {
  render(args) {
    const {leadingVisual: leadingVisualOption, ...rest} = args
    const leadingVisual = leadingVisualOption ? iconMap[leadingVisualOption as keyof typeof iconMap] : undefined
    return (
      <InlineMessage {...rest} leadingVisual={leadingVisual}>
        An example inline message
      </InlineMessage>
    )
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
    leadingVisual: {
      name: 'leadingVisual',
      control: {
        type: 'select',
      },
      options: Object.keys(iconMap),
      description: 'Select a custom icon to override the default variant icon',
    },
  },
  args: {
    size: 'medium',
    variant: 'success',
    leadingVisual: 'default',
  },
}
