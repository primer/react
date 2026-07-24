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
      {[
        'One',
        'Two',
        'Three',
        'Four',
        'Five',
        'Six',
        'Seven',
        'Eight',
        'Nine',
        'Ten',
        'Eleven',
        'Twelve',
        'Thirteen',
        'Fourteen',
        'Fifteen',
        'Sixteen',
      ].map(label => (
        <Label key={label}>{label}</Label>
      ))}
    </LabelGroup>
  ),
}
export const Playground: Story = {args: {as: 'ul'}}
