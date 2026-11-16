import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {Popover} from './Popover'

const meta = {
  title: 'React Tailwind/Components/Popover/Examples',
  component: Popover,
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const HelpPopover: Story = {
  render: () => (
    <Popover>
      <Popover.Button>Help</Popover.Button>
      <Popover.Content role="dialog">
        <Popover.Title>Helpful information</Popover.Title>
        <Popover.Description>Additional context is available here.</Popover.Description>
      </Popover.Content>
    </Popover>
  ),
  play: async ({canvasElement}) => {
    await userEvent.click(within(canvasElement).getByRole('button', {name: 'Help'}))
    await expect(
      within(document.body).findByRole('dialog', {
        name: 'Helpful information',
      }),
    ).resolves.toBeVisible()
  },
}
