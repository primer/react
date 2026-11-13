import type {Meta, StoryObj} from '@storybook/react-vite'
import {Radio} from '../Radio'
import {FormControl} from '../FormControl'
import {RadioGroup} from './RadioGroup'
const meta = {
  title: 'React Tailwind/Forms/RadioGroup',
  component: RadioGroup,
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <RadioGroup name="defaultRadioGroup" defaultValue="two">
      <RadioGroup.Label>Choices</RadioGroup.Label>
      <FormControl layout="horizontal">
        <Radio value="one" />
        <FormControl.Label>Choice one</FormControl.Label>
      </FormControl>
      <FormControl layout="horizontal">
        <Radio value="two" />
        <FormControl.Label>Choice two</FormControl.Label>
      </FormControl>
      <FormControl layout="horizontal">
        <Radio value="three" />
        <FormControl.Label>Choice three</FormControl.Label>
      </FormControl>
    </RadioGroup>
  ),
}
export const Playground: Story = {
  args: {name: 'defaultRadioGroup', defaultValue: 'two'},
  render: args => (
    <RadioGroup {...args}>
      <RadioGroup.Label>Choices</RadioGroup.Label>
      <FormControl layout="horizontal">
        <Radio value="one" />
        <FormControl.Label>Choice one</FormControl.Label>
      </FormControl>
      <FormControl layout="horizontal">
        <Radio value="two" />
        <FormControl.Label>Choice two</FormControl.Label>
      </FormControl>
      <FormControl layout="horizontal">
        <Radio value="three" />
        <FormControl.Label>Choice three</FormControl.Label>
      </FormControl>
    </RadioGroup>
  ),
}
