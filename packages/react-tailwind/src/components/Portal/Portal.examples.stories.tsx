import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, within} from 'storybook/test'
import {Portal} from './Portal'

const meta = {
  title: 'React Tailwind/Components/Portal/Examples',
  component: Portal,
} satisfies Meta<typeof Portal>

export default meta
type Story = StoryObj<typeof meta>

export const WithDialogContent: Story = {
  render: () => (
    <Portal>
      <div aria-label="Example dialog" role="dialog">
        Content rendered in the portal root
      </div>
    </Portal>
  ),
  play: async () => {
    await expect(within(document.body).findByRole('dialog', {name: 'Example dialog'})).resolves.toBeVisible()
  },
}
