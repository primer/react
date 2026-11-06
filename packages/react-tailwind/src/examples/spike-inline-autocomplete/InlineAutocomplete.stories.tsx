import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent} from 'storybook/test'
import {Before} from './Before'
import {Primer} from './Primer'
import {Raw} from './Raw'

const meta = {
  title: 'React Tailwind/Spikes/InlineAutocomplete',
  component: Primer,
  parameters: {layout: 'padded', a11y: {disable: true}},
} satisfies Meta<typeof Primer>
export default meta
type Story = StoryObj<typeof meta>

export const BeforeWorkaround: Story = {render: () => <Before />}
export const PrimerParts: Story = {
  play: async ({canvas}) => {
    const input = canvas.getByLabelText('Comment editor')
    await userEvent.type(input, 'Hello @mo')
    await userEvent.keyboard('{Enter}')
    await expect(input).toHaveValue('Hello @mona ')
    await expect(input).toHaveFocus()
  },
}
export const RawBaseUI: Story = {render: () => <Raw />}
export const PrimerSlashCommand: Story = {args: {slash: true}}
export const RawSlashCommand: Story = {render: () => <Raw slash />}
