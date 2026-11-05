import {BookIcon, InfoIcon, SearchIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, waitFor, within} from 'storybook/test'
import {Button} from '../Button'
import {IconButton} from '../IconButton'
import {Link} from '../Link'
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

const findOpenTooltip = () =>
  waitFor(() => {
    const tooltip = document.body.querySelector<HTMLElement>('[data-component="Tooltip.Content"][data-open]')
    if (!tooltip) throw new Error('Tooltip is not open')
    return tooltip
  })

const hoverPlay = async ({canvasElement}: {canvasElement: HTMLElement}) => {
  const trigger = canvasElement.querySelector<HTMLElement>('button, a')
  if (!trigger) throw new Error('Tooltip trigger not found')
  await userEvent.hover(trigger)
  const tooltip = await findOpenTooltip()
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
  render: () => (
    <Tooltip type="label">
      <Tooltip.Trigger
        render={
          <Link
            aria-label="Contribution Documentation for 'Primer React'"
            className="inline-flex text-muted"
            href="https://github.com/primer/react/contributor-docs/CONTRIBUTING.md"
          >
            <BookIcon />
          </Link>
        }
      />
      <Tooltip.Content side="bottom">Contribution Documentation for &apos;Primer React&apos;</Tooltip.Content>
    </Tooltip>
  ),
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
  render: () => (
    <Tooltip>
      <Tooltip.Trigger render={<IconButton icon={SearchIcon} aria-label="Search" />} />
      <Tooltip.Content side="right">Supplementary text for icon button</Tooltip.Content>
    </Tooltip>
  ),
  play: async ({canvasElement: _canvasElement}) => {
    await userEvent.tab()
    const tooltip = await findOpenTooltip()
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
  render: () => (
    <Tooltip keybindingHint="Shift+?" type="label">
      <Tooltip.Trigger
        render={
          <Link aria-label="Learn more" className="inline-flex" href="#">
            <InfoIcon />
          </Link>
        }
      />
      <Tooltip.Content side="bottom">Learn more</Tooltip.Content>
    </Tooltip>
  ),
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
