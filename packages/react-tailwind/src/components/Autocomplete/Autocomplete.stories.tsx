import {Autocomplete} from './Autocomplete'

export default {component: Autocomplete, title: 'Components/Autocomplete'}
const fruits = ['Apple', 'Banana', 'Orange']

export const Default = {
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
export const Playground = {
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
