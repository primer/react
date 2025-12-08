import type {Meta, StoryFn} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import {Combobox} from '.'

export default {
  title: 'Components/Combobox',
  component: Combobox,
} as Meta<ComponentProps<typeof Combobox>>

const options = [
  {label: 'Apple', id: '1'},
  {label: 'Banana', id: '2'},
  {label: 'Cherry', id: '3'},
  {label: 'Date', id: '4'},
  {label: 'Elderberry', id: '5'},
  {label: 'Fig', id: '6'},
  {label: 'Grape', id: '7'},
]

export const Playground: StoryFn<ComponentProps<typeof Combobox>> = args => <Combobox options={options} {...args} />

Playground.argTypes = {
  options: {
    control: 'object',
  },
}

export const Default = () => {
  return <Combobox label="Choose a fruit" options={options} />
}

const groupedOptions = [
  {label: 'Apple', id: '1', group: 'Fruits'},
  {label: 'Banana', id: '2', group: 'Fruits'},
  {label: 'Carrot', id: '3', group: 'Vegetables'},
  {label: 'Broccoli', id: '4', group: 'Vegetables'},
]

export const WithGroups = () => {
  return <Combobox label="Choose an item" options={groupedOptions} />
}

const optionsWithSelected = [
  {label: 'Apple', id: '1'},
  {label: 'Banana', id: '2', selected: true},
  {label: 'Cherry', id: '3'},
  {label: 'Date', id: '4'},
]

export const WithSelection = () => {
  return <Combobox label="Choose a fruit" options={optionsWithSelected} />
}
