import type {Meta, StoryFn} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import {Combobox} from '.'

export default {
  title: 'Components/Combobox',
  component: Combobox,
} as Meta<ComponentProps<typeof Combobox>>

export const Playground: StoryFn<ComponentProps<typeof Combobox>> = args => <Combobox {...args} />

Playground.argTypes = {
  ref: {
    control: false,
    table: {
      disable: true,
    },
  },
}

const options = [
  {text: 'Apple', id: 1},
  {text: 'Banana', id: 2},
  {text: 'Cherry', id: 3},
  {text: 'Date', id: 4},
  {text: 'Elderberry', id: 5},
  {text: 'Fig', id: 6},
  {text: 'Grape', id: 7},
]

export const Default = () => {
  return <Combobox label="Choose a fruit" options={options} />
}

export const WithGroups = () => {
  return (
    <Combobox label="Choose an item">
      <Combobox.List>
        <Combobox.Group groupLabel="Fruits">
          <Combobox.Option>Apple</Combobox.Option>
          <Combobox.Option>Banana</Combobox.Option>
        </Combobox.Group>
        <Combobox.Group groupLabel="Vegetables">
          <Combobox.Option>Carrot</Combobox.Option>
          <Combobox.Option>Broccoli</Combobox.Option>
        </Combobox.Group>
      </Combobox.List>
    </Combobox>
  )
}

export const WithSelection = () => {
  return (
    <Combobox>
      <Combobox.List>
        <Combobox.Option>Option 1</Combobox.Option>
        <Combobox.Option selected>Option 2 (Selected)</Combobox.Option>
        <Combobox.Option>Option 3</Combobox.Option>
      </Combobox.List>
    </Combobox>
  )
}
