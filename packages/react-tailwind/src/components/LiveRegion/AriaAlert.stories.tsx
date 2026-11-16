import type {Meta, StoryObj} from '@storybook/react-vite'
import {AriaAlert} from './LiveRegion'
import {useTickingMessage} from './LiveRegion.storyHelpers'

const meta = {
  title: 'React Tailwind/Components/AriaAlert',
  component: AriaAlert,
} satisfies Meta<typeof AriaAlert>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render() {
    const message = useTickingMessage()
    return <AriaAlert>{message}</AriaAlert>
  },
}

export const Playground: Story = {
  args: {
    announceOnShow: false,
  },
  render: args => <AriaAlert {...args}>Example message</AriaAlert>,
}
