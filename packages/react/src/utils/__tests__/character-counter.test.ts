import {describe, it, expect} from 'vitest'
import {getCharacterCountState} from '../character-counter'

describe('getCharacterCountState', () => {
  it('reports remaining characters when under the limit', () => {
    expect(getCharacterCountState(5, 10)).toEqual({
      count: 5,
      isOverLimit: false,
      message: '5 characters remaining',
    })
  })

  it('reports characters over when the limit is exceeded', () => {
    expect(getCharacterCountState(15, 10)).toEqual({
      count: 5,
      isOverLimit: true,
      message: '5 characters over',
    })
  })

  it('uses the singular "character" when one character remains', () => {
    expect(getCharacterCountState(9, 10)).toEqual({
      count: 1,
      isOverLimit: false,
      message: '1 character remaining',
    })
  })

  it('uses the singular "character" when over the limit by one', () => {
    expect(getCharacterCountState(11, 10)).toEqual({
      count: 1,
      isOverLimit: true,
      message: '1 character over',
    })
  })

  it('reports zero remaining when exactly at the limit', () => {
    expect(getCharacterCountState(10, 10)).toEqual({
      count: 0,
      isOverLimit: false,
      message: '0 characters remaining',
    })
  })

  it('reports the full limit as remaining when empty', () => {
    expect(getCharacterCountState(0, 20)).toEqual({
      count: 20,
      isOverLimit: false,
      message: '20 characters remaining',
    })
  })
})
