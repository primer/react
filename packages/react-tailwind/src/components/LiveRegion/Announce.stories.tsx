import type {Meta, StoryObj} from '@storybook/react-vite'
import {Announce} from './LiveRegion'
import {useTickingMessage} from './LiveRegion.storyHelpers'

const meta = {
  title: 'React Tailwind/Components/Announce',
  component: Announce,
} satisfies Meta<typeof Announce>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render() {
    const message = useTickingMessage()
    return <Announce>{message}</Announce>
  },
}

export const Playground: Story = {
  args: {
    announceOnShow: false,
    hidden: false,
    politeness: 'polite',
  },
  argTypes: {
    delayMs: {control: 'number'},
    politeness: {control: 'radio', options: ['polite', 'assertive']},
  },
  render: args => <Announce {...args}>Example message</Announce>,
}
