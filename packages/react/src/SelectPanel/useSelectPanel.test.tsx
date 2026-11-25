import {act, renderHook} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import type {ItemInput} from '../FilteredActionList'
import {getSelectedItems, useSelectPanel, type SelectPanelValue} from './useSelectPanel'
import {areItemsEqual} from '../internal/selectPanelSelection'

const first: ItemInput = {id: 'first', text: 'First'}

describe('SelectPanel selection state', () => {
  it('uses stable ids when result objects are recreated', () => {
    expect(getSelectedItems([first], {...first}, 'multiple', areItemsEqual)).toEqual([])
    expect(getSelectedItems([first], {...first}, 'single', areItemsEqual)).toEqual([])
  })

  it('preserves selected items outside the currently rendered results', () => {
    expect(getSelectedItems(['first'], 'second', 'multiple')).toEqual(['first', 'second'])
    expect(getSelectedItems(['first', 'second'], 'second', 'multiple')).toEqual(['first'])
  })

  it('falls back to object identity for legacy items without ids', () => {
    const item = {text: 'Legacy item'}
    expect(getSelectedItems([item], item, 'single', areItemsEqual)).toEqual([])
    expect(getSelectedItems([item], {...item}, 'multiple', areItemsEqual)).toEqual([item, {...item}])
  })

  it('keeps numeric and string ids distinct', () => {
    const numeric = {id: 1, text: 'Numeric'}
    const string = {id: '1', text: 'String'}
    expect(getSelectedItems<ItemInput>([numeric], string, 'multiple', areItemsEqual)).toEqual([numeric, string])
    expect(getSelectedItems<SelectPanelValue>([1], '1', 'multiple')).toEqual([1, '1'])
  })

  it('keeps selection, submission, and dismissal independent by default', () => {
    const onSelectedChange = vi.fn()
    const onOpenChange = vi.fn()
    const onSubmit = vi.fn()
    const {result} = renderHook(() => useSelectPanel({defaultOpen: true, onSelectedChange, onOpenChange, onSubmit}))
    act(() => result.current.selectItem('first'))
    expect(result.current.selected).toEqual(['first'])
    expect(result.current.open).toBe(true)
    expect(onSelectedChange).toHaveBeenCalledWith(['first'])
    expect(onSubmit).not.toHaveBeenCalled()
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it.each(['single', 'multiple'] as const)('supports explicit close-on-select for %s selection', selectionMode => {
    const onOpenChange = vi.fn()
    const onSubmit = vi.fn()
    const {result} = renderHook(() =>
      useSelectPanel({defaultOpen: true, closeOnSelect: true, selectionMode, onOpenChange, onSubmit}),
    )
    act(() => result.current.selectItem('first'))
    expect(result.current.open).toBe(false)
    expect(onOpenChange).toHaveBeenCalledWith(false, 'selection')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('does not close when selecting in multiple-selection mode', () => {
    const {result} = renderHook(() => useSelectPanel({defaultOpen: true, selectionMode: 'multiple'}))
    act(() => result.current.selectItem('first'))
    expect(result.current.open).toBe(true)
    act(() => result.current.selectItem('second'))
    expect(result.current.selected).toEqual(['first', 'second'])
  })

  it('does not commit controlled changes unless the owner supplies new values', () => {
    const onSelectedChange = vi.fn()
    const onOpenChange = vi.fn()
    const {result, rerender} = renderHook(
      ({selected, open}: {selected: SelectPanelValue[]; open: boolean}) =>
        useSelectPanel({selected, open, onSelectedChange, onOpenChange, closeOnSelect: true}),
      {initialProps: {selected: ['first'], open: true}},
    )
    act(() => result.current.selectItem('second'))
    expect(onSelectedChange).toHaveBeenCalledWith(['second'])
    expect(onOpenChange).toHaveBeenCalledWith(false, 'selection')
    expect(result.current.selected).toEqual(['first'])
    expect(result.current.open).toBe(true)
    rerender({selected: ['second'], open: false})
    expect(result.current.selected).toEqual(['second'])
    expect(result.current.open).toBe(false)
  })

  it('supports the legacy adapter guard for disabled records', () => {
    const onSelectedChange = vi.fn()
    const onOpenChange = vi.fn()
    const {result} = renderHook(() =>
      useSelectPanel<ItemInput>({
        defaultOpen: true,
        onSelectedChange,
        onOpenChange,
        closeOnSelect: true,
        isItemEqual: areItemsEqual,
        isItemDisabled: item => Boolean(item.disabled),
      }),
    )
    act(() => result.current.selectItem({...first, disabled: true}))
    expect(result.current.selected).toEqual([])
    expect(onSelectedChange).not.toHaveBeenCalled()
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('keeps query and selection independent', () => {
    const onFilterChange = vi.fn()
    const {result} = renderHook(() => useSelectPanel({defaultSelected: ['first'], onFilterChange}))
    act(() => result.current.setFilterValue('second', null))
    expect(result.current.filterValue).toBe('second')
    expect(result.current.selected).toEqual(['first'])
    expect(onFilterChange).toHaveBeenCalledWith('second', null)
  })

  it('submits the current selection without clearing the query or changing its owner', () => {
    const onSubmit = vi.fn()
    const onCancel = vi.fn()
    const onDismiss = vi.fn()
    const onOpenChange = vi.fn()
    const {result} = renderHook(() =>
      useSelectPanel({defaultOpen: true, defaultFilterValue: 'query', onSubmit, onCancel, onDismiss, onOpenChange}),
    )
    act(() => result.current.selectItem('second'))
    act(() => result.current.submit())
    expect(onSubmit).toHaveBeenCalledExactlyOnceWith(['second'])
    expect(onOpenChange).toHaveBeenCalledWith(false, 'submit')
    expect(onCancel).not.toHaveBeenCalled()
    expect(onDismiss).not.toHaveBeenCalled()
    expect(result.current.selected).toEqual(['second'])
    expect(result.current.filterValue).toBe('query')
  })

  it('notifies cancellation without silently rolling back application-owned drafts', () => {
    const onCancel = vi.fn()
    const onDismiss = vi.fn()
    const onOpenChange = vi.fn()
    const {result} = renderHook(() =>
      useSelectPanel({defaultOpen: true, defaultSelected: ['first'], onCancel, onDismiss, onOpenChange}),
    )
    act(() => result.current.selectItem('second'))
    act(() => result.current.cancel())
    expect(onCancel).toHaveBeenCalledOnce()
    expect(onDismiss).not.toHaveBeenCalled()
    expect(onOpenChange).toHaveBeenCalledWith(false, 'cancel')
    expect(result.current.selected).toEqual(['second'])
  })

  it.each(['close', 'escape', 'click-outside', 'anchor-click', 'back'] as const)(
    'reports %s as dismissal rather than cancellation or submission',
    reason => {
      const onDismiss = vi.fn()
      const onCancel = vi.fn()
      const onSubmit = vi.fn()
      const onOpenChange = vi.fn()
      const {result} = renderHook(() =>
        useSelectPanel({defaultOpen: true, onDismiss, onCancel, onSubmit, onOpenChange}),
      )
      act(() => result.current.dismiss(reason))
      expect(onDismiss).toHaveBeenCalledWith(reason)
      expect(onOpenChange).toHaveBeenCalledWith(false, reason)
      expect(onCancel).not.toHaveBeenCalled()
      expect(onSubmit).not.toHaveBeenCalled()
    },
  )

  it('clears only selection and honors controlled rejection', () => {
    const onSelectedChange = vi.fn()
    const {result} = renderHook(() =>
      useSelectPanel({
        selected: ['first'],
        onSelectedChange,
        defaultOpen: true,
        defaultFilterValue: 'query',
      }),
    )
    act(() => result.current.clearSelection())
    expect(onSelectedChange).toHaveBeenCalledWith([])
    expect(result.current.selected).toEqual(['first'])
    expect(result.current.filterValue).toBe('query')
    expect(result.current.open).toBe(true)
  })
})
