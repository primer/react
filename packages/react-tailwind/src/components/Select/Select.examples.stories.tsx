import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {Select} from './Select'

const meta = {
  title: 'React Tailwind/Forms/Select/Examples',
  component: Select,
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

function Choices({onChange, value}: {onChange?: React.ChangeEventHandler<HTMLSelectElement>; value?: string}) {
  return (
    <Select
      aria-label="Choice"
      defaultValue={value === undefined ? 'one' : undefined}
      onChange={onChange}
      value={value}
    >
      <Select.Option value="one">One</Select.Option>
      <Select.Option value="two">Two</Select.Option>
    </Select>
  )
}

export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState('one')
    return <Choices onChange={event => setValue(event.currentTarget.value)} value={value} />
  },
  play: async ({canvasElement}) => {
    const select = within(canvasElement).getByRole('combobox', {name: 'Choice'})
    await userEvent.selectOptions(select, 'two')
    await expect(select).toHaveValue('two')
  },
}

export const Uncontrolled: Story = {
  render: () => <Choices />,
  play: async ({canvasElement}) => {
    const select = within(canvasElement).getByRole('combobox', {name: 'Choice'})
    await userEvent.selectOptions(select, 'two')
    await expect(select).toHaveValue('two')
  },
}
