import type {Meta, StoryObj} from '@storybook/react-vite'
import {Details} from './Details'

const meta = {
  title: 'React Tailwind/Forms/Details/Features',
  component: Details,
} satisfies Meta<typeof Details>

export default meta
type Story = StoryObj<typeof meta>

export const WithCustomSummary: Story = {
  render: () => (
    <Details>
      <summary>Custom see Details</summary>
      This is some content
    </Details>
  ),
}
