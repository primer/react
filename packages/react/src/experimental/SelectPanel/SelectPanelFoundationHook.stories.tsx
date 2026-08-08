import {useMemo, useState} from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {useSelectPanel} from '../../foundations/experimental/SelectPanel'
import {useFilter, useSelectionState} from '../../hooks/experimental'
import {branches, type Ref} from './mock-refs'

/**
 * Layer 1 — compound hook story.
 *
 * Demonstrates `useSelectPanel` with **consumer-owned markup**: the hook returns
 * prop-getters that wire up the dialog/combobox/listbox ARIA, keyboard navigation
 * and lifecycle, while the consumer renders (and styles) every element itself.
 * This is the escape hatch for full markup control.
 */
const meta: Meta = {
  title: 'Experimental/SelectPanel (Modular)/Foundation Hook',
  parameters: {controls: {expanded: true}},
}
export default meta

const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  marginTop: 4,
  width: 300,
  border: '1px solid #d1d9e0',
  borderRadius: 12,
  background: 'white',
  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  padding: 8,
}

export const WithPropGetters: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false)
    const filter = useFilter()
    const selection = useSelectionState({selectionVariant: 'single'})

    const panel = useSelectPanel({open, onOpenChange: next => setOpen(next)})
    const anchorProps = panel.getAnchorProps()
    const overlayProps = panel.getOverlayProps()
    const titleProps = panel.getTitleProps()
    const inputProps = panel.getInputProps()
    const listProps = panel.getListProps()

    const items: Ref[] = useMemo(() => filter.filter(branches, b => b.name), [filter])

    return (
      <div style={{position: 'relative', display: 'inline-block'}}>
        <button {...anchorProps} ref={anchorProps.ref as React.Ref<HTMLButtonElement>} type="button">
          Pick a branch
        </button>
        {panel.isOpen ? (
          <div {...overlayProps} ref={overlayProps.ref as React.Ref<HTMLDivElement>} style={overlayStyle}>
            <h2 {...titleProps} style={{margin: '0 0 8px', fontSize: 14}}>
              Branches
            </h2>
            <input
              {...inputProps}
              aria-label="Filter branches"
              placeholder="Filter branches"
              value={filter.query}
              onChange={e => filter.setQuery(e.target.value)}
              style={{width: '100%', boxSizing: 'border-box', padding: '6px 8px'}}
            />
            <ul
              {...listProps}
              style={{listStyle: 'none', margin: '8px 0 0', padding: 0, maxHeight: 200, overflowY: 'auto'}}
            >
              {items.map(item => {
                const optionProps = panel.getOptionProps({id: item.id, selected: selection.isSelected(item.id)})
                return (
                  <li
                    {...optionProps}
                    key={item.id}
                    onClick={() => selection.toggle(item.id)}
                    style={{
                      padding: '6px 8px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      background: optionProps['data-active-descendant'] !== undefined ? '#ddf4ff' : 'transparent',
                    }}
                  >
                    {item.name}
                  </li>
                )
              })}
            </ul>
          </div>
        ) : null}
      </div>
    )
  },
}
