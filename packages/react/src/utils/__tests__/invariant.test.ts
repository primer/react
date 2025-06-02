import {describe, expect, it} from 'vitest'
import {invariant} from '../invariant'

describe('invariant', () => {
  it('throws an error when the condition is `false`', () => {
    expect(() => {
      invariant(false, 'test')
    }).toThrow('test')
  })

  it('does not throw an error when the condition is `true`', () => {
    expect(() => {
      invariant(true, 'test')
    }).not.toThrow()
  })

  it('formats arguments into error string', () => {
    expect(() => {
      invariant(false, 'test %s %s %s', 1, 2, 3)
    }).toThrow('test 1 2 3')
  })
})
