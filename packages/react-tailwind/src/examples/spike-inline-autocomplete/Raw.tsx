'use client'

import {Autocomplete} from '@base-ui/react/autocomplete'
import {useInlineEditor, type Suggestion} from './useInlineEditor'

export function Raw({slash = false}: {slash?: boolean}) {
  const editor = useInlineEditor(slash)
  return (
    <>
      <Autocomplete.Root {...editor.rootProps}>
        <label htmlFor={editor.id}>{editor.inputProps['aria-label']}</label>
        <Autocomplete.Input
          id={editor.id}
          onKeyDown={editor.onKeyDown}
          render={
            <textarea
              {...editor.inputProps}
              rows={7}
              cols={30}
              className="block m-0 rounded-md border border-[var(--control-borderColor-rest)] bg-default p-3 text-sm [line-height:normal] text-default shadow-[var(--shadow-inset)] focus:border-accent-emphasis focus:outline-2 focus:outline-offset-[-1px] focus:outline-[var(--borderColor-accent-emphasis)]"
            />
          }
        />
        <Autocomplete.Portal>
          <Autocomplete.Positioner
            anchor={editor.anchor}
            side="bottom"
            align="start"
            sideOffset={4}
            className="z-popover"
          >
            <Autocomplete.Popup className="min-w-48 overflow-auto rounded-md border border-default bg-default p-1 shadow-floating-lg outline-none">
              <Autocomplete.List aria-label="Suggestions" className="m-0 max-h-72 list-none overflow-auto p-0">
                {(item: Suggestion) => (
                  <Autocomplete.Item
                    key={item.label}
                    value={item}
                    className="flex w-full cursor-default items-center rounded-md px-2 py-1.5 text-sm text-default outline-none data-[highlighted]:bg-neutral-muted data-[disabled]:cursor-not-allowed data-[disabled]:text-disabled"
                  >
                    {item.label}
                  </Autocomplete.Item>
                )}
              </Autocomplete.List>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
      {slash && <output aria-label="Last command">{editor.command || 'No command'}</output>}
    </>
  )
}
