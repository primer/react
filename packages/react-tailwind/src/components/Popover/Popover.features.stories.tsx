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

/**
 * These stories open on load, so focus stays in place until the user interacts.
 * User-initiated opens and closes still move focus into and back out of the popover.
 */
const focusOnInteraction = (openType: string) => Boolean(openType)

export const CloseOnClickOutside: Story = {
  render: () => (
    <div className="flex w-full flex-col items-center">
      <Popover defaultOpen>
        <Popover.Button className="mb-1">Toggle Popover</Popover.Button>
        <Popover.Content
          portal={false}
          positionerClassName="!relative !inset-auto !transform-none mt-1 self-center"
          finalFocus={focusOnInteraction}
          initialFocus={focusOnInteraction}
          role="dialog"
          sideOffset={0}
        >
          <Popover.Arrow />
          <Popover.Title>Popover heading</Popover.Title>
          <Popover.Description className="my-4 text-md leading-6 text-default">
            Message about popovers
          </Popover.Description>
          <Popover.Close render={<Button />}>Got it!</Popover.Close>
        </Popover.Content>
      </Popover>
    </div>
  ),
}

export const CloseOnEscape: Story = {
  render: () => (
    <div className="flex w-full flex-col items-center">
      <Popover defaultOpen>
        <Popover.Button className="mb-1">Toggle Popover</Popover.Button>
        <Popover.Content
          portal={false}
          positionerClassName="!relative !inset-auto !transform-none mt-1 self-center"
          finalFocus={focusOnInteraction}
          initialFocus={focusOnInteraction}
          role="dialog"
          sideOffset={0}
        >
          <Popover.Arrow />
          <Popover.Title>Popover heading</Popover.Title>
          <Popover.Description className="my-4 text-md leading-6 text-default">
            Press Escape to dismiss this popover.
          </Popover.Description>
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
