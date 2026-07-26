import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {Button} from '../Button'
import {Tooltip} from './Tooltip'

const meta = {
  title: 'React Tailwind/Components/Tooltip/Features',
  component: Tooltip,
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

const TooltipFixture = ({
  side = 'top',
  text = 'Supplementary text',
  children = 'Button',
}: {
  side?: 'top' | 'right' | 'bottom' | 'left'
  text?: string
  children?: React.ReactNode
}) => (
  <Tooltip>
    <Tooltip.Trigger render={<Button>{children}</Button>} />
    <Tooltip.Content side={side}>{text}</Tooltip.Content>
  </Tooltip>
)

const hoverPlay = async ({canvasElement}: {canvasElement: HTMLElement}) => {
  const trigger = within(canvasElement).getAllByRole('button')[0]
  await userEvent.hover(trigger)
  const tooltip = await within(document.body).findByRole('tooltip')
  await expect(tooltip).toHaveAttribute('data-open')
  await new Promise(resolve => setTimeout(resolve, 150))
  await expect(tooltip).toBeVisible()
}

export const AnchorHasMargin: Story = {
  render: () => (
    <div className="p-4">
      <TooltipFixture />
    </div>
  ),
  play: hoverPlay,
}
export const LabelType: Story = {
  render: () => <TooltipFixture text="Label for this link" />,
  play: hoverPlay,
}
export const DescriptionType: Story = {
  render: () => <TooltipFixture />,
  play: hoverPlay,
}
export const DescriptionTypeWithExternalDescription: Story = {
  render: () => (
    <>
      <TooltipFixture />
      <span id="external-description" className="sr-only">
        External description
      </span>
    </>
  ),
  play: hoverPlay,
}
export const IconButtonWithDescription: Story = {
  render: () => <TooltipFixture side="right" text="Search" />,
  play: async ({canvasElement: _canvasElement}) => {
    await userEvent.tab()
    const tooltip = await within(document.body).findByRole('tooltip')
    await expect(tooltip).toHaveAttribute('data-open')
    await new Promise(resolve => setTimeout(resolve, 150))
    await expect(tooltip).toBeVisible()
  },
}
export const AllDirections: Story = {
  render: () => (
    <div className="flex gap-2">
      <TooltipFixture side="top" />
      <TooltipFixture side="bottom" />
      <TooltipFixture side="left" />
      <TooltipFixture side="right" />
    </div>
  ),
  play: hoverPlay,
}
export const MultilineText: Story = {
  render: () => <TooltipFixture side="right" text={'Long text that wraps across multiple lines. '.repeat(4)} />,
  play: hoverPlay,
}
export const CalculatedDirection: Story = {
  render: () => <TooltipFixture side="left" />,
  play: hoverPlay,
}
export const OnActionMenuAnchor: Story = {
  render: () => <TooltipFixture text="Action menu help" />,
  play: hoverPlay,
}
export const KeybindingHint: Story = {
  render: () => <TooltipFixture text="Learn more · Shift+?" />,
  play: hoverPlay,
}
export const WithMediumDelay: Story = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger render={<Button>With delay</Button>} />
      <Tooltip.Content>Delayed tooltip</Tooltip.Content>
    </Tooltip>
  ),
  play: async ({canvasElement}) => {
    const trigger = within(canvasElement).getByRole('button')
    await userEvent.hover(trigger)
    const tooltip = await within(document.body).findByRole('tooltip')
    await expect(tooltip).toHaveAttribute('data-open')
    await new Promise(resolve => setTimeout(resolve, 150))
    await expect(tooltip).toBeVisible()
  },
}
export const WithLongDelay: Story = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger render={<Button>Favorite</Button>} />
      <Tooltip.Content>Favorite</Tooltip.Content>
    </Tooltip>
  ),
  play: async ({canvasElement}) => {
    const trigger = within(canvasElement).getByRole('button')
    await userEvent.hover(trigger)
    const tooltip = await within(document.body).findByRole('tooltip')
    await expect(tooltip).toHaveAttribute('data-open')
    await new Promise(resolve => setTimeout(resolve, 150))
    await expect(tooltip).toBeVisible()
  },
}
