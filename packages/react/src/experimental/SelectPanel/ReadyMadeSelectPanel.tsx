import React, {useMemo, useRef} from 'react'
import {SelectPanelParts as Parts} from './SelectPanel'
import {useFilter, useSelectionState} from '../../hooks/experimental'
import type {SelectionVariant} from '../../hooks/experimental/useSelectionState'
import type {SelectPanelGesture} from '../../foundations/experimental/SelectPanel'

export interface SelectPanelItem {
  /** Stable identifier used as the selection key. */
  id: string
  /** Visible, searchable label. */
  text: string
  disabled?: boolean
}

export interface SelectPanelProps {
  /** Whether the panel is open. */
  open: boolean
  /** Called when the panel requests to open or close. */
  onOpenChange: (open: boolean, gesture: SelectPanelGesture) => void
  /** Visible title for the panel. */
  title: React.ReactNode
  /** Content rendered inside the anchor button. */
  anchor: React.ReactNode
  /** The selectable items. */
  items: SelectPanelItem[]
  /** @default 'single' */
  selectionVariant?: SelectionVariant
  /** Controlled selected keys. */
  selectedKeys?: Iterable<string>
  /** Initial selected keys (uncontrolled). */
  defaultSelectedKeys?: Iterable<string>
  /** Called when the selection changes. */
  onSelectionChange?: (keys: Set<string>) => void
  /** Placeholder for the search input. */
  placeholder?: string
  /** Width of the overlay. */
  width?: 'small' | 'medium' | 'large'
  className?: string
}

/**
 * Layer 3 — Ready-made SelectPanel for the simple, **no-tabs** case.
 *
 * This is the drop-in props API for the 80% scenario: pass `items`, get a
 * filterable single- or multi-select panel. It composes the Layer 2 Parts
 * internally and owns its own filter state.
 *
 * ⚠️ Tabbed / compositional use cases are intentionally **not** supported here —
 * adding a `tabs` prop would re-introduce exactly the config-creep this
 * architecture exists to avoid. For tabs, compose the Layer 2 `SelectPanelParts`
 * with the `Tabs` primitive directly (see the spec and the Parts story).
 */
export const SelectPanel = React.forwardRef<HTMLDivElement, SelectPanelProps>(function SelectPanel(
  {
    open,
    onOpenChange,
    title,
    anchor,
    items,
    selectionVariant = 'single',
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    placeholder = 'Filter…',
    width = 'medium',
    className,
  },
  ref,
) {
  const anchorRef = useRef<HTMLButtonElement>(null)
  const filter = useFilter()
  const selection = useSelectionState({
    selectionVariant,
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
  })

  const filteredItems = useMemo(() => filter.filter(items, item => item.text), [filter, items])

  return (
    <Parts
      ref={ref}
      open={open}
      onOpenChange={onOpenChange}
      selectionVariant={selectionVariant}
      returnFocusRef={anchorRef}
      className={className}
    >
      <Parts.Anchor ref={anchorRef}>{anchor}</Parts.Anchor>
      <Parts.Overlay width={width}>
        <Parts.Header>
          <Parts.Title>{title}</Parts.Title>
          <Parts.Input
            aria-label={typeof title === 'string' ? title : 'Filter'}
            placeholder={placeholder}
            value={filter.query}
            onChange={e => filter.setQuery(e.target.value)}
          />
        </Parts.Header>
        {filteredItems.length === 0 ? (
          <Parts.Empty>No matches</Parts.Empty>
        ) : (
          <Parts.List aria-label="Results">
            {filteredItems.map(item => (
              <Parts.Option
                key={item.id}
                id={item.id}
                disabled={item.disabled}
                selected={selection.isSelected(item.id)}
                onClick={() => {
                  if (item.disabled) return
                  selection.toggle(item.id)
                  if (selectionVariant === 'single') onOpenChange(false, 'selection')
                }}
              >
                {item.text}
              </Parts.Option>
            ))}
          </Parts.List>
        )}
      </Parts.Overlay>
    </Parts>
  )
})

SelectPanel.displayName = 'SelectPanel'
