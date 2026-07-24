import type {Meta, StoryObj} from '@storybook/react-vite'
import {Button} from '../Button'
import {Popover} from './Popover'

const meta = {
  title: 'React Tailwind/Components/Popover',
  component: Popover,
} satisfies Meta<typeof Popover>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Popover>
      <Popover.Button>Open popover</Popover.Button>
      <Popover.Content>Popover content</Popover.Content>
    </Popover>
  ),
}
export const Playground: Story = {
  render: () => (
    <Popover modal>
      <Popover.Trigger render={<Button>Open modal popover</Button>} />
      <Popover.Content>
        <Popover.Close>Close</Popover.Close>
      </Popover.Content>
    </Popover>
  ),
}
export const WithArrow: Story = {
  render: () => (
    <Popover>
      <Popover.Button>More</Popover.Button>
      <Popover.Content>
        <Popover.Arrow />
        Positioned content
      </Popover.Content>
    </Popover>
  ),
}
