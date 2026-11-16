import type {Meta, StoryObj} from '@storybook/react-vite'
import {Checkbox} from '../Checkbox'
import {FormControl} from '../FormControl'
import {CheckboxGroup} from './CheckboxGroup'
const meta = {
  title: 'React Tailwind/Forms/CheckboxGroup',
  component: CheckboxGroup,
} satisfies Meta<typeof CheckboxGroup>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <CheckboxGroup defaultValue={['one', 'two']}>
      <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
      <FormControl layout="horizontal" required>
        <Checkbox value="one" />
        <FormControl.Label>Choice one</FormControl.Label>
      </FormControl>
      <FormControl layout="horizontal">
        <Checkbox value="two" />
        <FormControl.Label>Choice two</FormControl.Label>
      </FormControl>
      <FormControl layout="horizontal">
        <Checkbox value="three" />
        <FormControl.Label>Choice three</FormControl.Label>
      </FormControl>
    </CheckboxGroup>
  ),
}
export const Playground: Story = {
  args: {defaultValue: ['one', 'two'], disabled: false},
  render: args => (
    <CheckboxGroup {...args}>
      <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
      <FormControl layout="horizontal">
        <Checkbox value="one" />
        <FormControl.Label>Choice one</FormControl.Label>
      </FormControl>
      <FormControl layout="horizontal">
        <Checkbox value="two" />
        <FormControl.Label>Choice two</FormControl.Label>
      </FormControl>
      <FormControl layout="horizontal">
        <Checkbox value="three" />
        <FormControl.Label>Choice three</FormControl.Label>
      </FormControl>
    </CheckboxGroup>
  ),
}
