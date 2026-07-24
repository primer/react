import type {Meta, StoryObj} from '@storybook/react-vite'
import {Card, CardDescription, CardHeading} from './Card'
const meta = {
  title: 'React Tailwind/Content/Card',
  component: Card,
  render: args => (
    <Card {...args}>
      <CardHeading>Card Heading</CardHeading>
      <CardDescription>This is a description of the card providing supplemental information.</CardDescription>
    </Card>
  ),
} satisfies Meta<typeof Card>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {args: {as: 'section', layout: 'default', padding: 'normal'}}
