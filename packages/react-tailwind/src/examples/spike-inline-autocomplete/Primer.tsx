'use client'

import {Autocomplete} from '../../components/Autocomplete'
import {Textarea} from '../../components/Textarea'
import {useInlineEditor, type Suggestion} from './useInlineEditor'

export function Primer({slash = false}: {slash?: boolean}) {
  const editor = useInlineEditor(slash)
  return (
    <>
      <Autocomplete {...editor.rootProps}>
        <label htmlFor={editor.id}>{editor.inputProps['aria-label']}</label>
        <Autocomplete.Input id={editor.id} onKeyDown={editor.onKeyDown} render={<Textarea {...editor.inputProps} />} />
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
      {slash && <output aria-label="Last command">{editor.command || 'No command'}</output>}
    </>
  )
}
