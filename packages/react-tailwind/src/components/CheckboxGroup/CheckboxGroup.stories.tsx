import type {Meta, StoryObj} from '@storybook/react-vite'
import {Checkbox} from '../Checkbox'
import {CheckboxGroup} from './CheckboxGroup'
const meta = {
  title: 'React Tailwind/Forms/CheckboxGroup',
  component: CheckboxGroup,
} satisfies Meta<typeof CheckboxGroup>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <CheckboxGroup>
      <span>
        <Checkbox id="checkbox-one" value="one" />
        <label htmlFor="checkbox-one"> One</label>
      </span>
      <span>
        <Checkbox id="checkbox-two" value="two" />
        <label htmlFor="checkbox-two"> Two</label>
      </span>
    </CheckboxGroup>
  ),
}
export const Playground: Story = {
  args: {defaultValue: ['one'], disabled: false},
  render: (args: React.ComponentProps<typeof CheckboxGroup>) => (
    <CheckboxGroup {...args}>
      <Checkbox value="one" />
      <Checkbox value="two" />
    </CheckboxGroup>
  ),
}
