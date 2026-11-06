'use client'

import {Autocomplete as BaseAutocomplete} from '@base-ui/react/autocomplete'
import {Autocomplete} from '../../components/Autocomplete'
import {Textarea} from '../../components/Textarea'
import {useInlineEditor, type Suggestion} from './useInlineEditor'

// A: uses only parts present before this spike. The blocked Primer Input must be bypassed.
export function Before() {
  const editor = useInlineEditor()
  return (
    <Autocomplete {...editor.rootProps}>
      <label htmlFor={editor.id}>Comment editor</label>
      <BaseAutocomplete.Input
        id={editor.id}
        onKeyDown={editor.onKeyDown}
        render={<Textarea {...editor.inputProps} />}
      />
      <Autocomplete.Content anchor={editor.anchor}>
        <Autocomplete.List aria-label="Suggestions">
          {(item: Suggestion) => (
            <Autocomplete.Item key={item.label} value={item}>
              {item.label}
            </Autocomplete.Item>
          )}
        </Autocomplete.List>
      </Autocomplete.Content>
    </Autocomplete>
  )
}
