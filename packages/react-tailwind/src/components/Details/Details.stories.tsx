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
      <Details.Summary>More options</Details.Summary>
      <p>Additional content</p>
    </Details>
  ),
}
export const Playground: Story = {
  args: {open: false},
  render: (args: React.ComponentProps<typeof Details>) => (
    <Details {...args}>
      <Details.Summary>More options</Details.Summary>
      <p>Additional content</p>
    </Details>
  ),
}
