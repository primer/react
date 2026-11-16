import type {Meta, StoryObj} from '@storybook/react-vite'
import {AriaStatus} from './LiveRegion'
import {useTickingMessage} from './LiveRegion.storyHelpers'

const meta = {
  title: 'React Tailwind/Components/AriaStatus',
  component: AriaStatus,
} satisfies Meta<typeof AriaStatus>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render() {
    const message = useTickingMessage()
    return <AriaStatus>{message}</AriaStatus>
  },
}

export const Playground: Story = {
  args: {
    announceOnShow: false,
    hidden: false,
  },
  argTypes: {
    delayMs: {control: 'number'},
  },
  render: args => <AriaStatus {...args}>Example message</AriaStatus>,
}
