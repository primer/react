import type {Meta, StoryObj} from '@storybook/react-vite'
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
      <Details.Summary>See Details</Details.Summary>
      This is some content
    </Details>
  ),
}
export const Playground: Story = {
  args: {open: false},
  render: (args: React.ComponentProps<typeof Details>) => (
    <Details {...args}>
      <Details.Summary>See Details</Details.Summary>
      This is some content
    </Details>
  ),
}
