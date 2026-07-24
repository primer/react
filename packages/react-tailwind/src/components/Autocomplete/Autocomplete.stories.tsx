import type {Meta, StoryObj} from '@storybook/react-vite'
import {Autocomplete} from './Autocomplete'

const meta = {
  title: 'React Tailwind/Components/Autocomplete',
  component: Autocomplete,
} satisfies Meta<typeof Autocomplete>

export default meta

type Story = StoryObj<typeof meta>
const fruits = ['Apple', 'Banana', 'Orange']

export const Default: Story = {
  render: () => (
    <Autocomplete items={fruits}>
      <Autocomplete.Input aria-label="Fruit" placeholder="Find a fruit" />
      <Autocomplete.Content>
        <Autocomplete.List>
          {(fruit: string) => <Autocomplete.Item value={fruit}>{fruit}</Autocomplete.Item>}
        </Autocomplete.List>
      </Autocomplete.Content>
    </Autocomplete>
  ),
}
export const Playground: Story = {
  render: () => (
    <Autocomplete items={fruits} mode="both">
      <Autocomplete.Input aria-label="Fruit" />
      <Autocomplete.Content>
        <Autocomplete.List>
          {(fruit: string) => <Autocomplete.Item value={fruit}>{fruit}</Autocomplete.Item>}
        </Autocomplete.List>
      </Autocomplete.Content>
    </Autocomplete>
  ),
}
