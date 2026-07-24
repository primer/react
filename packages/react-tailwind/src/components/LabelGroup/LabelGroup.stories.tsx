import type {Meta, StoryObj} from '@storybook/react-vite'
import {LabelGroup} from './LabelGroup'
import {Label} from '../Label'

const meta = {
  title: 'React Tailwind/Display/LabelGroup',
  component: LabelGroup,
} satisfies Meta<typeof LabelGroup>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <LabelGroup>
      <Label>bug</Label>
      <Label>help wanted</Label>
    </LabelGroup>
  ),
}
export const Playground: Story = {args: {as: 'ul'}}
