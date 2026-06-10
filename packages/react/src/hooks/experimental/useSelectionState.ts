import {useCallback, useMemo, useState} from 'react'

/**
 * The selection behaviour of a list.
 *
 * - `single` — at most one item selected at a time. Selecting a new item
 *   replaces the previous selection.
 * - `multiple` — any number of items selected. Selecting toggles membership.
 */
export type SelectionVariant = 'single' | 'multiple'

export interface UseSelectionStateOptions {
  /** @default 'single' */
  selectionVariant?: SelectionVariant

  /** Initial selected keys (uncontrolled). */
  defaultSelectedKeys?: Iterable<string>

  /** Controlled selected keys. When provided, the hook does not own the state. */
  selectedKeys?: Iterable<string>

  /** Called whenever the selection changes. */
  onSelectionChange?: (keys: Set<string>) => void
}

export interface UseSelectionStateReturn {
  /** The currently-selected keys. */
  selectedKeys: Set<string>
  /** Whether a given key is selected. */
  isSelected: (key: string) => boolean
  /** Toggle a key according to the selection variant. */
  toggle: (key: string) => void
  /** Replace the entire selection. */
  setSelection: (keys: Iterable<string>) => void
  /** Clear all selected keys. */
  clear: () => void
}

/**
 * Decoupled selection state for a list of items, owned by the consumer rather
 * than the component that renders the list.
 *
 * Because the state lives outside any component tree, the **same** selection can
 * be shared across multiple lists — e.g. two tabs (Branches / Tags) in a single
 * SelectPanel that contribute to one selection. Keys are opaque strings.
 */
export function useSelectionState(options: UseSelectionStateOptions = {}): UseSelectionStateReturn {
  const {selectionVariant = 'single', defaultSelectedKeys, selectedKeys: controlledKeys, onSelectionChange} = options

  const [internalKeys, setInternalKeys] = useState<Set<string>>(() => new Set(defaultSelectedKeys ?? []))

  const isControlled = controlledKeys !== undefined
  const selectedKeys = useMemo(
    () => (isControlled ? new Set(controlledKeys) : internalKeys),
    [isControlled, controlledKeys, internalKeys],
  )

  const commit = useCallback(
    (next: Set<string>) => {
      if (!isControlled) {
        setInternalKeys(next)
      }
      onSelectionChange?.(next)
    },
    [isControlled, onSelectionChange],
  )

  const isSelected = useCallback((key: string) => selectedKeys.has(key), [selectedKeys])

  const toggle = useCallback(
    (key: string) => {
      const next = new Set(selectedKeys)
      if (selectionVariant === 'single') {
        if (next.has(key)) {
          next.clear()
        } else {
          next.clear()
          next.add(key)
        }
      } else {
        if (next.has(key)) {
          next.delete(key)
        } else {
          next.add(key)
        }
      }
      commit(next)
    },
    [selectedKeys, selectionVariant, commit],
  )

  const setSelection = useCallback(
    (keys: Iterable<string>) => {
      commit(new Set(keys))
    },
    [commit],
  )

  const clear = useCallback(() => {
    commit(new Set())
  }, [commit])

  return {selectedKeys, isSelected, toggle, setSelection, clear}
}
