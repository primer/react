import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {Button} from '../Button'
import {Tooltip, type TooltipContentProps, type TooltipRootProps} from './Tooltip'

interface TooltipStoryArgs
  extends Pick<TooltipRootProps, 'disableHoverablePopup' | 'trackCursorAxis'>,
    Pick<TooltipContentProps, 'align' | 'side' | 'sideOffset'> {}

const meta = {
  title: 'React Tailwind/Components/Tooltip',
  args: {
    align: 'center',
    disableHoverablePopup: true,
    side: 'right',
    sideOffset: 8,
    trackCursorAxis: 'none',
  },
  argTypes: {
    align: {control: 'select', options: ['start', 'center', 'end']},
    disableHoverablePopup: {control: 'boolean'},
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right', 'inline-start', 'inline-end'],
    },
    sideOffset: {control: {type: 'number', min: 0}},
    trackCursorAxis: {control: 'select', options: ['none', 'x', 'y', 'both']},
  },
} satisfies Meta<TooltipStoryArgs>

export default meta

type Story = StoryObj<TooltipStoryArgs>

export const Default: Story = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger render={<Button>Save</Button>} />
      <Tooltip.Content>Save this file</Tooltip.Content>
    </Tooltip>
  ),
  play: async ({canvasElement}) => {
    await userEvent.hover(within(canvasElement).getByRole('button', {name: 'Save'}))
    const tooltip = await within(document.body).findByRole('tooltip')
    await expect(tooltip).toHaveAttribute('data-open')
    await new Promise(resolve => setTimeout(resolve, 150))
    await expect(tooltip).toBeVisible()
    await expect(tooltip).toHaveTextContent('Save this file')
  },
}
export const Playground: Story = {
  render: args => (
    <Tooltip disableHoverablePopup={args.disableHoverablePopup} trackCursorAxis={args.trackCursorAxis}>
      <Tooltip.Trigger>Info</Tooltip.Trigger>
      <Tooltip.Content align={args.align} side={args.side} sideOffset={args.sideOffset}>
        Additional information
      </Tooltip.Content>
    </Tooltip>
  ),
  play: async ({canvasElement}) => {
    await userEvent.hover(within(canvasElement).getByRole('button', {name: 'Info'}))
    const tooltip = await within(document.body).findByRole('tooltip')
    await expect(tooltip).toHaveAttribute('data-open')
    await new Promise(resolve => setTimeout(resolve, 150))
    await expect(tooltip).toBeVisible()
    await expect(tooltip).toHaveTextContent('Additional information')
  },
}
export const WithArrow: Story = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger>More</Tooltip.Trigger>
      <Tooltip.Content>
        <Tooltip.Arrow />
        More information
      </Tooltip.Content>
    </Tooltip>
  ),
  play: async ({canvasElement}) => {
    await userEvent.hover(within(canvasElement).getByRole('button', {name: 'More'}))
    const tooltip = await within(document.body).findByRole('tooltip')
    await expect(tooltip).toHaveAttribute('data-open')
    await new Promise(resolve => setTimeout(resolve, 150))
    await expect(tooltip).toBeVisible()
    await expect(tooltip).toHaveTextContent('More information')
  },
}
