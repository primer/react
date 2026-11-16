import {describe, expect, it} from 'vitest'
import {joinIdRefs} from './idRefs'

describe('joinIdRefs', () => {
  it('joins ids in order and skips empty entries', () => {
    expect(joinIdRefs('validation', undefined, '', false, null, 'caption')).toBe('validation caption')
  })

  it('splits existing lists and drops duplicates', () => {
    expect(joinIdRefs('hint  note', 'note', 'loading')).toBe('hint note loading')
  })

  it('returns undefined when no ids remain', () => {
    expect(joinIdRefs(undefined, '', ' ')).toBeUndefined()
  })
})
