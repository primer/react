import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, within} from 'storybook/test'
import {Button} from '../Button'
import {Popover} from './Popover'

const meta = {
  title: 'React Tailwind/Components/Popover/Features',
  component: Popover,
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const CloseOnClickOutside: Story = {
  render: () => (
    <div className="flex w-full flex-col items-center">
      <Popover defaultOpen>
        <Popover.Button className="mb-1">Toggle Popover</Popover.Button>
        <Popover.Content
          portal={false}
          positionerClassName="!relative !inset-auto !transform-none mt-1 w-[var(--overlay-width-small)] self-center"
          role="dialog"
          sideOffset={0}
        >
          <Popover.Title>Popover heading</Popover.Title>
          <Popover.Description className="my-4 text-base leading-6">Message about popovers</Popover.Description>
          <Popover.Close render={<Button />}>Got it!</Popover.Close>
        </Popover.Content>
      </Popover>
    </div>
  ),
}

export const DisabledTrigger: Story = {
  render: () => (
    <Popover>
      <Popover.Button disabled>Disabled popover</Popover.Button>
      <Popover.Content role="dialog">This content should not open.</Popover.Content>
    </Popover>
  ),
  play: async ({canvasElement}) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Disabled popover',
    })
    await expect(trigger).toBeDisabled()
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
  },
}
