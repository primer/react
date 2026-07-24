import type {Meta, StoryObj} from '@storybook/react-vite'
import {Radio} from '../Radio'
import {RadioGroup} from './RadioGroup'
const meta = {
  title: 'React Tailwind/Forms/RadioGroup',
  component: RadioGroup,
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <RadioGroup name="view">
      <span>
        <Radio id="view-list" value="list" />
        <label htmlFor="view-list"> List</label>
      </span>
      <span>
        <Radio id="view-grid" value="grid" />
        <label htmlFor="view-grid"> Grid</label>
      </span>
    </RadioGroup>
  ),
}
export const Playground: Story = {args: {name: 'view', defaultValue: 'list'}}
