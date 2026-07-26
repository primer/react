import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, within} from 'storybook/test'
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
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByRole('status')).toHaveTextContent('Saved changes')
  },
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
