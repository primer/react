import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {Announce} from './LiveRegion'

const meta = {
  title: 'React Tailwind/Components/LiveRegion',
  component: Announce,
} satisfies Meta<typeof Announce>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Announce>Saved changes</Announce>,
}

export const Playground: Story = {
  render: args => {
    const [message, setMessage] = useState('No updates yet')

    return (
      <>
        <button onClick={() => setMessage('Changes saved')} type="button">
          Save changes
        </button>
        <Announce {...args}>{message}</Announce>
      </>
    )
  },
  args: {
    politeness: 'polite',
  },
}
