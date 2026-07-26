import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, within} from 'storybook/test'
import {Overlay} from './Overlay'

const meta = {
  title: 'React Tailwind/Components/Overlay/Examples',
  component: Overlay,
} satisfies Meta<typeof Overlay>

export default meta
type Story = StoryObj<typeof meta>

export const ControlledDialog: Story = {
  render: () => (
    <Overlay aria-label="Example overlay" className="w-80 p-4" role="dialog">
      Controlled overlay content
    </Overlay>
  ),
  play: async ({canvasElement}) => {
    await expect(within(canvasElement).getByRole('dialog', {name: 'Example overlay'})).toBeVisible()
  },
}
