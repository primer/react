import {describe, expect, test} from 'vitest'
import {invariant} from '../invariant'

describe('invariant', () => {
  test('throws an error when the condition is `false`', () => {
    expect(() => {
      invariant(false, 'test')
    }).toThrow('test')
  })

  test('does not throw an error when the condition is `true`', () => {
    expect(() => {
      invariant(true, 'test')
    }).not.toThrow()
  })

  test('formats arguments into error string', () => {
    expect(() => {
      invariant(false, 'test %s %s %s', 1, 2, 3)
    }).toThrow('test 1 2 3')
  })
})
