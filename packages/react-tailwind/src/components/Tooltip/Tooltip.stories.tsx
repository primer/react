import type {Meta, StoryObj} from '@storybook/react-vite'
import {Button} from '../Button'
import {Tooltip, type TooltipContentProps, type TooltipRootProps} from './Tooltip'

const meta = {
  title: 'React Tailwind/Components/Tooltip',
  component: Tooltip,
} satisfies Meta<typeof Tooltip>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="p-10">
      <Tooltip>
        <Tooltip.Trigger render={<Button>Delete</Button>} />
        <Tooltip.Content>This change can&apos;t be undone.</Tooltip.Content>
      </Tooltip>
    </div>
  ),
}

interface PlaygroundArgs
  extends Pick<TooltipRootProps, 'delay' | 'keybindingHint'>,
    Pick<TooltipContentProps, 'align' | 'side'> {
  text: string
}

// A label tooltip on a button with visible text would replace that text as its name, so the playground only
// demonstrates description tooltips.
export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    align: 'center',
    delay: 'short',
    keybindingHint: '',
    side: 'bottom',
    text: 'This is the tooltip text',
  },
  argTypes: {
    align: {control: 'radio', options: ['start', 'center', 'end']},
    delay: {control: 'radio', options: ['short', 'medium', 'long']},
    keybindingHint: {control: 'text'},
    side: {control: 'radio', options: ['top', 'right', 'bottom', 'left']},
    text: {control: 'text'},
  },
  render: ({align, delay, keybindingHint, side, text}) => (
    <div className="p-10">
      <Tooltip delay={delay} keybindingHint={keybindingHint || undefined}>
        <Tooltip.Trigger render={<Button>Delete</Button>} />
        <Tooltip.Content align={align} side={side}>
          {text}
        </Tooltip.Content>
      </Tooltip>
    </div>
  ),
}

export const WithArrow: Story = {
  render: () => (
    <div className="p-10">
      <Tooltip>
        <Tooltip.Trigger render={<Button>More</Button>} />
        <Tooltip.Content sideOffset={8}>
          <Tooltip.Arrow />
          More information
        </Tooltip.Content>
      </Tooltip>
    </div>
  ),
}
