import type {Meta, StoryObj} from '@storybook/react-vite'
import {Button} from '../Button'
import {Details} from './Details'
const meta = {
  title: 'React Tailwind/Forms/Details',
  component: Details,
} satisfies Meta<typeof Details>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <Details>
      <Button block nativeButton={false} render={<Details.Summary />}>
        See Details
      </Button>
      This is some content
    </Details>
  ),
}
export const Playground: Story = {
  args: {open: false},
  render: (args: React.ComponentProps<typeof Details>) => (
    <Details {...args}>
      <Button block nativeButton={false} render={<Details.Summary />}>
        See Details
      </Button>
      This is some content
    </Details>
  ),
}
