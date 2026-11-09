import {Autocomplete as BaseAutocomplete} from '@base-ui/react/autocomplete'
import React from 'react'
import {createRoot} from 'react-dom/client'
import {ActionList} from '../src/components/ActionList'
import {Autocomplete} from '../src/components/Autocomplete'

export function Fixture({mode}: {mode: string | null}) {
  if (mode === 'action-list') {
    return (
      <ActionList.Listbox aria-label="Files" disableFocusZone>
        <ActionList.LinkItem href="#readme" role="option" tabIndex={-1}>
          README.md
        </ActionList.LinkItem>
      </ActionList.Listbox>
    )
  }
  if (mode === 'native') {
    return (
      <ul aria-label="Files">
        <li>
          <a href="#readme">README.md</a>
        </li>
      </ul>
    )
  }
  if (mode === 'raw') {
    return (
      <>
        <BaseAutocomplete.Root defaultOpen items={['README.md']}>
          <BaseAutocomplete.Input aria-label="Find a file" />
          <BaseAutocomplete.Portal>
            <BaseAutocomplete.Positioner>
              <BaseAutocomplete.Popup>
                <BaseAutocomplete.List>
                  <BaseAutocomplete.Item value="README.md" render={<a href="#readme">README.md</a>} />
                </BaseAutocomplete.List>
              </BaseAutocomplete.Popup>
            </BaseAutocomplete.Positioner>
          </BaseAutocomplete.Portal>
        </BaseAutocomplete.Root>
        <input aria-label="After results" />
      </>
    )
  }
  return (
    <>
      <Autocomplete.Root defaultOpen items={['README.md']}>
        <Autocomplete.Input aria-label="Find a file" />
        <Autocomplete.Content>
          <Autocomplete.List>
            <Autocomplete.Item value="README.md" render={<a href="#readme">README.md</a>} />
          </Autocomplete.List>
        </Autocomplete.Content>
      </Autocomplete.Root>
      <input aria-label="After results" />
    </>
  )
}

function mountFixture() {
  const root = document.getElementById('root')
  if (!root) throw new Error('Autocomplete link fixture root not found')
  createRoot(root).render(<Fixture mode={new URLSearchParams(location.search).get('mode')} />)
}

mountFixture()
