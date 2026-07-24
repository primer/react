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
    <RadioGroup name="defaultRadioGroup" defaultValue="two">
      <span>
        <Radio id="radio-one" value="one" />
        <label htmlFor="radio-one">Choice one</label>
      </span>
      <span>
        <Radio id="radio-two" value="two" />
        <label htmlFor="radio-two">Choice two</label>
      </span>
      <span>
        <Radio id="radio-three" value="three" />
        <label htmlFor="radio-three">Choice three</label>
      </span>
    </RadioGroup>
  ),
}
export const Playground: Story = {args: {name: 'defaultRadioGroup', defaultValue: 'two'}}
