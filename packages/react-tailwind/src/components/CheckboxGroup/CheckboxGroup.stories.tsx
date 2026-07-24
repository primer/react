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
    <CheckboxGroup aria-label="Choices">
      <span>
        <Checkbox id="checkbox-one" value="one" defaultChecked />
        <label htmlFor="checkbox-one">Choice one</label>
      </span>
      <span>
        <Checkbox id="checkbox-two" value="two" defaultChecked />
        <label htmlFor="checkbox-two">Choice two</label>
      </span>
      <span>
        <Checkbox id="checkbox-three" value="three" />
        <label htmlFor="checkbox-three">Choice three</label>
      </span>
    </CheckboxGroup>
  ),
}
export const Playground: Story = {
  args: {defaultValue: ['one', 'two'], disabled: false},
  render: (args: React.ComponentProps<typeof CheckboxGroup>) => (
    <CheckboxGroup {...args}>
      <Checkbox aria-label="Choice one" value="one" />
      <Checkbox aria-label="Choice two" value="two" />
      <Checkbox aria-label="Choice three" value="three" />
    </CheckboxGroup>
  ),
}
