import {describe, expect, it} from 'vitest'
import {areItemsEqual, doesItemsIncludeItem, getSelectedItems} from './selectPanelSelection'

describe('configured SelectPanel selection identity', () => {
  it('uses explicit IDs, including zero, without coercion', () => {
    expect(areItemsEqual({id: 0}, {id: 0})).toBe(true)
    expect(areItemsEqual({id: 0}, {id: '0'})).toBe(false)
  })

  it('preserves object identity when no ID is provided', () => {
    const item = {text: 'one'}
    expect(areItemsEqual(item, item)).toBe(true)
    expect(areItemsEqual(item, {text: 'one'})).toBe(false)
    expect(doesItemsIncludeItem([item], item)).toBe(true)
    expect(getSelectedItems(item)).toEqual([item])
    expect(getSelectedItems(undefined)).toEqual([])
    const selected = [item]
    expect(getSelectedItems(selected)).toBe(selected)
  })
})
