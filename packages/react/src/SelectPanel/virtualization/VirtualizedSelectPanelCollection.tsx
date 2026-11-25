import React from 'react'
import {defaultRangeExtractor, useVirtualizer} from '@tanstack/react-virtual'
import {ActionList} from '../../ActionList'
import {useMergedRefs} from '../../hooks/useMergedRefs'
import useLayoutEffect from '../../utils/useIsomorphicLayoutEffect'
import {invariant} from '../../utils/invariant'
import {SelectPanel} from '..'
import {useSelectPanelContext} from '../SelectPanelContext'
import type {SelectPanelValue} from '../useSelectPanel'
import classes from './VirtualizedSelectPanelCollection.module.css'

export interface VirtualSelectPanelItem {
  value: SelectPanelValue
  label: string
  disabled?: boolean
}

function findEnabledIndex(items: readonly VirtualSelectPanelItem[], start: number, direction: 1 | -1, wrap = false) {
  for (let offset = 0; offset < items.length; offset++) {
    const index = wrap
      ? (((start + offset * direction) % items.length) + items.length) % items.length
      : start + offset * direction
    if (index < 0 || index >= items.length) return -1
    if (!items[index].disabled) return index
  }
  return -1
}

function canNavigate(event: React.KeyboardEvent) {
  return !event.defaultPrevented && !event.nativeEvent.isComposing && !event.altKey && !event.ctrlKey && !event.metaKey
}

function itemKey(value: SelectPanelValue) {
  return `${typeof value}:${value}`
}

// Internal, flat, fixed-height proof of concept; not a new SelectPanel part.
export function VirtualizedSelectPanelCollection({items}: {items: readonly VirtualSelectPanelItem[]}) {
  const state = useSelectPanelContext()
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)
  const ref = useMergedRefs(listRef, state.setCollectionElement)
  const rows = React.useRef(new Map<SelectPanelValue, HTMLLIElement>())
  const focusWithin = React.useRef(false)
  const pendingFocus = React.useRef<SelectPanelValue | undefined>(undefined)
  const previousItems = React.useRef(items)
  const [activeValue, setActiveValue] = React.useState<SelectPanelValue>()
  const indexes = React.useMemo(() => {
    const result = new Map<SelectPanelValue, number>()
    for (const [index, item] of items.entries()) {
      invariant(!result.has(item.value), 'Virtualized SelectPanel items must have unique values.')
      result.set(item.value, index)
    }
    return result
  }, [items])
  const firstEnabled = findEnabledIndex(items, 0, 1)
  const lastEnabled = findEnabledIndex(items, items.length - 1, -1)
  const previousIndex = activeValue === undefined ? undefined : indexes.get(activeValue)
  const activeIndex = previousIndex !== undefined && !items[previousIndex].disabled ? previousIndex : firstEnabled

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => viewportRef.current,
    estimateSize: () => 32,
    overscan: 5,
    getItemKey: index => {
      const item = items.at(index)
      return item ? itemKey(item.value) : `removed:${index}`
    },
    rangeExtractor: range => {
      const visible = defaultRangeExtractor(range)
      return activeIndex < 0 ? visible : Array.from(new Set([...visible, activeIndex])).sort((a, b) => a - b)
    },
  })

  function focusItem(index: number) {
    if (index < 0) return
    const value = items[index].value
    pendingFocus.current = value
    setActiveValue(value)
    const offset = virtualizer.getOffsetForIndex(index, 'auto')
    if (!offset) throw new Error('Cannot navigate an unmeasured virtualized SelectPanel item.')
    // Fixed rows need no async measurement retries that could outlive a filter change.
    virtualizer.scrollToOffset(offset[0])
    const row = rows.current.get(value)
    if (row) {
      pendingFocus.current = undefined
      row.focus({preventScroll: true})
    }
  }

  useLayoutEffect(() => {
    if (previousItems.current !== items) {
      previousItems.current = items
      if (!focusWithin.current) virtualizer.scrollToOffset(0)
    }
    const pending = pendingFocus.current
    if (pending !== undefined) {
      const row = rows.current.get(pending)
      const index = indexes.get(pending)
      if (index === undefined || items[index].disabled) {
        pendingFocus.current = undefined
      } else if (row) {
        pendingFocus.current = undefined
        row.focus({preventScroll: true})
      }
    }
    const list = listRef.current
    if (list && focusWithin.current && pendingFocus.current === undefined) {
      const focused = list.ownerDocument.activeElement
      const activeUnavailable = previousIndex === undefined || items[previousIndex].disabled
      if (focused === list.ownerDocument.body || (activeUnavailable && list.contains(focused))) {
        if (activeIndex >= 0) focusItem(activeIndex)
        else state.inputRef.current?.focus()
      }
    }
  })

  return (
    <div className={classes.Collection} data-component="SelectPanel.VirtualizedCollection">
      <SelectPanel.SearchInput
        aria-label="Filter virtualized items"
        placeholder="Find an item"
        onFocus={() => {
          focusWithin.current = false
          pendingFocus.current = undefined
          setActiveValue(undefined)
        }}
        onKeyDown={event => {
          if (!canNavigate(event)) return
          const index = event.key === 'ArrowDown' ? firstEnabled : event.key === 'ArrowUp' ? lastEnabled : -1
          if (index >= 0) {
            event.preventDefault()
            focusItem(index)
          }
        }}
      />
      <div className={classes.Viewport} ref={viewportRef}>
        <ActionList
          ref={ref}
          id={state.listId}
          role="listbox"
          aria-label="Virtualized items"
          aria-multiselectable={state.selectionMode === 'multiple' ? true : undefined}
          selectionVariant={state.selectionMode}
          variant="full"
          disableFocusZone
          className={classes.List}
          style={{height: virtualizer.getTotalSize()}}
          onBlur={event => {
            if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
              focusWithin.current = false
              pendingFocus.current = undefined
            }
          }}
          onKeyDown={event => {
            if (!canNavigate(event) || !(event.target instanceof HTMLElement)) return
            const index = items.findIndex(item => rows.current.get(item.value) === event.target)
            if (index < 0) return
            let next: number
            const pageSize = Math.max(1, Math.floor((viewportRef.current?.clientHeight ?? 32) / 32))
            switch (event.key) {
              case 'ArrowDown':
                next = findEnabledIndex(items, index + 1, 1, true)
                break
              case 'ArrowUp':
                next = findEnabledIndex(items, index - 1, -1, true)
                break
              case 'Home':
                next = firstEnabled
                break
              case 'End':
                next = lastEnabled
                break
              case 'PageDown':
                next = findEnabledIndex(items, Math.min(items.length - 1, index + pageSize), 1)
                if (next < 0) next = lastEnabled
                break
              case 'PageUp':
                next = findEnabledIndex(items, Math.max(0, index - pageSize), -1)
                if (next < 0) next = firstEnabled
                break
              default:
                return
            }
            event.preventDefault()
            focusItem(next)
          }}
        >
          {virtualizer.getVirtualItems().map(virtualRow => {
            const item = items[virtualRow.index]
            return (
              <SelectPanel.Item
                key={itemKey(item.value)}
                ref={node => {
                  if (node) rows.current.set(item.value, node)
                  else rows.current.delete(item.value)
                }}
                value={item.value}
                disabled={item.disabled}
                tabIndex={virtualRow.index === activeIndex ? 0 : -1}
                aria-posinset={virtualRow.index + 1}
                aria-setsize={items.length}
                className={classes.Row}
                style={{height: virtualRow.size, transform: `translateY(${virtualRow.start}px)`}}
                onFocus={() => {
                  focusWithin.current = true
                  setActiveValue(item.value)
                }}
              >
                {item.label}
              </SelectPanel.Item>
            )
          })}
        </ActionList>
      </div>
    </div>
  )
}
