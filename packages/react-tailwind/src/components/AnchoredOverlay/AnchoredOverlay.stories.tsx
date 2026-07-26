import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, waitFor, within} from 'storybook/test'
import {Button} from '../Button'
import {AnchoredOverlay, type AnchoredOverlayContentProps, type AnchoredOverlayRootProps} from './AnchoredOverlay'

interface AnchoredOverlayStoryArgs
  extends Pick<AnchoredOverlayRootProps, 'modal'>,
    Pick<AnchoredOverlayContentProps, 'align' | 'side' | 'sideOffset'> {}

const meta = {
  title: 'React Tailwind/Components/AnchoredOverlay',
  args: {
    align: 'start',
    modal: 'trap-focus',
    side: 'bottom',
    sideOffset: 4,
  },
  argTypes: {
    align: {control: 'select', options: ['start', 'center', 'end']},
    modal: {control: 'select', options: [false, true, 'trap-focus']},
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right', 'inline-start', 'inline-end'],
    },
    sideOffset: {control: {type: 'number', min: 0}},
  },
} satisfies Meta<AnchoredOverlayStoryArgs>

export default meta

type Story = StoryObj<AnchoredOverlayStoryArgs>

export const Default: Story = {
  render: () => (
    <AnchoredOverlay>
      <AnchoredOverlay.Trigger render={<Button>Button</Button>} />
      <AnchoredOverlay.Content className="w-80 p-4" role="dialog" aria-label="User Card Overlay">
        <div className="flex items-start justify-between gap-2">
          <div className="h-12 w-12 rounded-full bg-muted" />
          <Button size="small">Follow</Button>
        </div>
        <div className="mt-2 text-sm font-medium">monalisa</div>
        <p className="mt-2 text-sm">
          Former beach cat and champion swimmer. Now your friendly octopus with a normal face.
        </p>
        <p className="mt-2 text-xs text-muted">Interwebs</p>
        <p className="mt-1 text-xs text-muted">Owns this repository</p>
      </AnchoredOverlay.Content>
    </AnchoredOverlay>
  ),
}
export const Playground: Story = {
  render: args => (
    <AnchoredOverlay modal={args.modal}>
      <AnchoredOverlay.Trigger render={<Button>Button</Button>} />
      <AnchoredOverlay.Content align={args.align} side={args.side} sideOffset={args.sideOffset}>
        <AnchoredOverlay.Close>Close</AnchoredOverlay.Close>
      </AnchoredOverlay.Content>
    </AnchoredOverlay>
  ),
}
export const WithArrow: Story = {
  render: () => (
    <AnchoredOverlay>
      <AnchoredOverlay.Trigger render={<Button>Button</Button>} />
      <AnchoredOverlay.Content>
        <AnchoredOverlay.Arrow />
        Positioned overlay
      </AnchoredOverlay.Content>
    </AnchoredOverlay>
  ),
  play: async ({canvasElement}) => {
    await userEvent.click(within(canvasElement).getByRole('button', {name: 'Button'}))
    const content = await within(document.body).findByText('Positioned overlay')
    await waitFor(() => expect(content).toBeVisible())
  },
}
