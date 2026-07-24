import type {Meta, StoryObj} from '@storybook/react-vite'
import {Button} from '../Button'
import {Tooltip} from './Tooltip'

const meta = {
  title: 'React Tailwind/Components/Tooltip',
  component: Tooltip,
} satisfies Meta<typeof Tooltip>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger render={<Button>Save</Button>} />
      <Tooltip.Content>Save this file</Tooltip.Content>
    </Tooltip>
  ),
}
export const Playground: Story = {
  render: () => (
    <Tooltip disableHoverablePopup>
      <Tooltip.Trigger>Info</Tooltip.Trigger>
      <Tooltip.Content side="right">Additional information</Tooltip.Content>
    </Tooltip>
  ),
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
}
