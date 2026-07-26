import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {ActionBar} from './ActionBar'

const meta = {
  title: 'React Tailwind/Data/ActionBar/Features',
  component: ActionBar,
} satisfies Meta<typeof ActionBar>

export default meta
type Story = StoryObj<typeof meta>

export const RovingFocus: Story = {
  render: () => (
    <ActionBar aria-label="Issue actions">
      <ActionBar.Button>Assign</ActionBar.Button>
      <ActionBar.Button>Label</ActionBar.Button>
      <ActionBar.Button disabled>Disabled</ActionBar.Button>
    </ActionBar>
  ),
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('button', {name: 'Label'})).toHaveFocus()
  },
}
