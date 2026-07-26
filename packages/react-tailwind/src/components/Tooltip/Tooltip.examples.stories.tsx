import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {Button} from '../Button'
import {Tooltip} from './Tooltip'

const meta = {
  title: 'React Tailwind/Components/Tooltip/Examples',
  component: Tooltip,
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

const tooltipPlay = async ({canvasElement}: {canvasElement: HTMLElement}) => {
  await userEvent.hover(within(canvasElement).getAllByRole('button')[0])
  const tooltip = await within(document.body).findByRole('tooltip')
  await expect(tooltip).toHaveAttribute('data-open')
  await new Promise(resolve => setTimeout(resolve, 150))
  await expect(tooltip).toBeVisible()
}

export const CustomId: Story = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger render={<Button aria-label="Close feedback form">Close</Button>} />
      <Tooltip.Content>Close feedback form</Tooltip.Content>
    </Tooltip>
  ),
  play: tooltipPlay,
}

export const FilesPage: Story = {
  render: () => (
    <div className="flex gap-2">
      <Tooltip>
        <Tooltip.Trigger render={<Button>main</Button>} />
        <Tooltip.Content>Supplementary branch information</Tooltip.Content>
      </Tooltip>
      <Tooltip>
        <Tooltip.Trigger render={<Button>More file actions</Button>} />
        <Tooltip.Content>More file actions</Tooltip.Content>
      </Tooltip>
    </div>
  ),
  play: tooltipPlay,
}

export const DialogTrigger: Story = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger render={<Button>Merge</Button>} />
      <Tooltip.Content>Ready to merge</Tooltip.Content>
    </Tooltip>
  ),
  play: tooltipPlay,
}

export const EmojiPicker: Story = {
  render: () => (
    <div className="grid max-w-48 grid-cols-3 gap-1">
      {['😀', '😍', '🎉', '👍', '🔥', '🚀'].map(emoji => (
        <Tooltip key={emoji}>
          <Tooltip.Trigger render={<Button aria-label={emoji}>{emoji}</Button>} />
          <Tooltip.Content>{emoji}</Tooltip.Content>
        </Tooltip>
      ))}
    </div>
  ),
  play: tooltipPlay,
}
