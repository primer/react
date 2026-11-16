import React from 'react'
import {describe, expect, it} from 'vitest'
import {areItemsEqual, getItemRenderKey, getItemText, itemIdKey} from './collectionItem'

describe('areItemsEqual', () => {
  it('matches items by id without conflating numeric and string ids', () => {
    expect(areItemsEqual({id: 'a'}, {id: 'a'})).toBe(true)
    expect(areItemsEqual({id: 1}, {id: '1'})).toBe(false)
  })

  it('falls back to reference equality when neither item has an id', () => {
    const item = {text: 'Mona'}
    expect(areItemsEqual(item, item)).toBe(true)
    expect(areItemsEqual({text: 'Mona'}, {text: 'Mona'})).toBe(false)
  })

  it('never matches an item that has an id against one that does not', () => {
    expect(areItemsEqual({id: 'a'}, {text: 'a'})).toBe(false)
  })
})

describe('getItemText', () => {
  it('prefers an explicit filter value', () => {
    expect(getItemText({filterValue: 'mona', text: 'Mona Lisa'})).toBe('mona')
  })

  it('reads text from nested element and array children', () => {
    expect(getItemText({text: <span>Mona</span>})).toBe('Mona')
    expect(getItemText({children: ['Mona', ' ', 'Lisa']})).toBe('Mona Lisa')
  })

  it('returns an empty string when an item has no textual content', () => {
    expect(getItemText({id: 'mona'})).toBe('')
  })
})

describe('getItemRenderKey', () => {
  it('prefers id, then key, then position', () => {
    expect(getItemRenderKey({id: 'a'}, 3)).toBe(`id:${itemIdKey('a')}`)
    expect(getItemRenderKey({key: 'a'}, 3)).toBe(`key:${itemIdKey('a')}`)
    expect(getItemRenderKey({}, 3)).toBe('item:3')
  })

  it('distinguishes ids that share a string representation', () => {
    expect(getItemRenderKey({id: 1}, 0)).not.toBe(getItemRenderKey({id: '1'}, 0))
  })
})
