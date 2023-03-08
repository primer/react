import {invariant} from '../invariant'

test('throws an error when the condition is `false`', () => {
  expect(() => {
    invariant(false, 'test')
  }).toThrowError('test')
})

test('does not throw an error when the condition is `true`', () => {
  expect(() => {
    invariant(true, 'test')
  }).not.toThrowError()
})

test('formats arguments into error string', () => {
  expect(() => {
    invariant(false, 'test %s %s %s', 1, 2, 3)
  }).toThrowError('test 1 2 3')
})
