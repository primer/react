import type {Meta, StoryObj} from '@storybook/react-vite'
import {Stack, StackItem} from './Stack'

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  render: args => <Stack {...args}>Stack content</Stack>,
} satisfies Meta<typeof Stack>
export default meta
export const Default: StoryObj<typeof meta> = {args: {gap: 'normal'}}
export const Playground: StoryObj<typeof meta> = {args: {direction: 'horizontal', align: 'center', gap: 'cozy'}}
export const Responsive: StoryObj<typeof meta> = {
  render: () => (
    <Stack direction={{narrow: 'vertical', regular: 'horizontal'}} gap="normal">
      <StackItem className="rounded-md bg-muted p-2">One</StackItem>
      <StackItem className="rounded-md bg-muted p-2">Two</StackItem>
    </Stack>
  ),
}
