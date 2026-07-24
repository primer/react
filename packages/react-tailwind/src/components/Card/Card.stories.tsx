import type {Meta, StoryObj} from '@storybook/react-vite'
import {Card, CardDescription, CardHeading} from './Card'
const meta = {
  title: 'Content/Card',
  component: Card,
  render: args => (
    <Card {...args}>
      <CardHeading>Project</CardHeading>
      <CardDescription>Project details and status.</CardDescription>
    </Card>
  ),
} satisfies Meta<typeof Card>
export default meta
export const Default: StoryObj<typeof meta> = {}
export const Playground: StoryObj<typeof meta> = {args: {as: 'section', layout: 'compact', padding: 'condensed'}}
