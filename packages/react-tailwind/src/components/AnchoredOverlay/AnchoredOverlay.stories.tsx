import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, waitFor, within} from 'storybook/test'
import {Button} from '../Button'
import {AnchoredOverlay, type AnchoredOverlayContentProps, type AnchoredOverlayRootProps} from './AnchoredOverlay'
import {HoverCard} from './AnchoredOverlay.storyHelpers'

interface AnchoredOverlayStoryArgs
  extends Pick<AnchoredOverlayRootProps, 'modal'>,
    Pick<AnchoredOverlayContentProps, 'align' | 'height' | 'side' | 'sideOffset' | 'width'> {}

const meta = {
  title: 'React Tailwind/Components/AnchoredOverlay',
  args: {
    align: 'start',
    height: 'auto',
    modal: 'trap-focus',
    side: 'bottom',
    sideOffset: 4,
    width: 'auto',
  },
  argTypes: {
    align: {control: 'select', options: ['start', 'center', 'end']},
    height: {control: 'select', options: ['xsmall', 'small', 'medium', 'large', 'xlarge', 'auto', 'initial']},
    modal: {control: 'select', options: [false, true, 'trap-focus']},
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right', 'inline-start', 'inline-end'],
    },
    sideOffset: {control: {type: 'number', min: 0}},
    width: {control: 'select', options: ['small', 'medium', 'large', 'xlarge', 'xxlarge', 'auto']},
  },
} satisfies Meta<AnchoredOverlayStoryArgs>

export default meta

type Story = StoryObj<AnchoredOverlayStoryArgs>

export const Default: Story = {
  render: () => (
    <AnchoredOverlay>
      <AnchoredOverlay.Trigger render={<Button>Button</Button>} />
      <AnchoredOverlay.Content className="min-w-80" role="dialog" aria-label="User Card Overlay">
        <HoverCard />
      </AnchoredOverlay.Content>
    </AnchoredOverlay>
  ),
}
export const Playground: Story = {
  render: args => (
    <AnchoredOverlay modal={args.modal}>
      <AnchoredOverlay.Trigger render={<Button>Button</Button>} />
      <AnchoredOverlay.Content
        align={args.align}
        aria-label="User Card Overlay"
        className="min-w-80"
        height={args.height}
        role="dialog"
        side={args.side}
        sideOffset={args.sideOffset}
        width={args.width}
      >
        <HoverCard />
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
