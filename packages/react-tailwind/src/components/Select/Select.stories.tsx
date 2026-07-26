import type {Meta, StoryObj} from '@storybook/react-vite'
import {FormControl} from '../FormControl'
import {Select, type SelectProps} from './Select'

type SelectStoryArgs = Pick<
  SelectProps,
  'block' | 'contrast' | 'disabled' | 'multiple' | 'placeholder' | 'required' | 'size' | 'validationStatus'
>

const options = (
  <>
    <Select.Option value="one">Choice one</Select.Option>
    <Select.Option value="two">Choice two</Select.Option>
    <Select.Option value="three">Choice three</Select.Option>
    <Select.Option value="four">Choice four</Select.Option>
    <Select.Option value="five">Choice five</Select.Option>
    <Select.Option value="six">Choice six</Select.Option>
  </>
)

const meta = {
  title: 'React Tailwind/Forms/Select',
  component: Select,
  args: {
    block: false,
    contrast: false,
    disabled: false,
    multiple: false,
    placeholder: undefined,
    required: false,
    size: 'medium',
    validationStatus: undefined,
  },
  argTypes: {
    block: {control: 'boolean'},
    contrast: {control: 'boolean'},
    disabled: {control: 'boolean'},
    multiple: {control: 'boolean'},
    placeholder: {control: 'text'},
    required: {control: 'boolean'},
    size: {control: 'radio', options: ['small', 'medium', 'large']},
    validationStatus: {control: 'radio', options: ['error', 'success', undefined]},
  },
} satisfies Meta<SelectStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

function Example(args: SelectStoryArgs) {
  return (
    <form>
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <Select {...args}>{options}</Select>
      </FormControl>
    </form>
  )
}

export const Default: Story = {render: () => <Example />}
export const Playground: Story = {render: args => <Example {...args} />}
