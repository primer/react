import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {Autocomplete} from './Autocomplete'

const meta = {
  title: 'React Tailwind/Components/Autocomplete/Examples',
  component: Autocomplete,
} satisfies Meta<typeof Autocomplete>
export default meta
type Story = StoryObj<typeof meta>

const items = ['Apple', 'Banana', 'Orange']

function FruitAutocomplete({value, onValueChange}: {value?: string; onValueChange?: (value: string) => void}) {
  return (
    <Autocomplete items={items} value={value} onValueChange={onValueChange}>
      <Autocomplete.Input aria-label="Fruit" />
      <Autocomplete.Content>
        <Autocomplete.List>
          {(item: string) => (
            <Autocomplete.Item key={item} value={item}>
              {item}
            </Autocomplete.Item>
          )}
        </Autocomplete.List>
      </Autocomplete.Content>
    </Autocomplete>
  )
}

export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState('')
    return <FruitAutocomplete value={value} onValueChange={setValue} />
  },
  play: async ({canvasElement}) => {
    const input = within(canvasElement).getByRole('combobox', {
      name: 'Fruit',
    })
    await userEvent.type(input, 'App')
    await expect(input).toHaveValue('App')
  },
}

export const Uncontrolled: Story = {
  render: () => <FruitAutocomplete />,
  play: async ({canvasElement}) => {
    const input = within(canvasElement).getByRole('combobox', {
      name: 'Fruit',
    })
    await userEvent.click(input)
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await expect(input).toHaveValue('Apple')
  },
}
