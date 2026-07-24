import type {Meta, StoryObj} from '@storybook/react-vite'
import {Stack, StackItem} from './Stack'

const meta = {
  title: 'React Tailwind/Layout/Stack',
  component: Stack,
  render: args => <Stack {...args}>Stack content</Stack>,
} satisfies Meta<typeof Stack>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {args: {gap: 'normal'}}
export const Playground: Story = {args: {direction: 'horizontal', align: 'center', gap: 'cozy'}}
export const Responsive: Story = {
  render: () => (
    <Stack direction={{narrow: 'vertical', regular: 'horizontal'}} gap="normal">
      <StackItem className="rounded-md bg-muted p-2">One</StackItem>
      <StackItem className="rounded-md bg-muted p-2">Two</StackItem>
    </Stack>
  ),
}
