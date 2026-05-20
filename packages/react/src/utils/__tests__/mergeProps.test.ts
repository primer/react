import {test, expect, vi} from 'vitest'
import {mergeProps} from '../mergeProps'

test('merges className', () => {
  const propsA = {className: 'foo'}
  const propsB = {className: 'bar'}
  const merged = mergeProps(propsA, propsB)

  expect(merged.className).toBe('foo bar')
})

test('merges event handlers', () => {
  const onClickA = vi.fn()
  const onClickB = vi.fn()
  const propsA = {onClick: onClickA}
  const propsB = {onClick: onClickB}
  const merged = mergeProps(propsA, propsB)
  merged.onClick(new MouseEvent('click'))

  expect(onClickA).toHaveBeenCalled()
  expect(onClickB).toHaveBeenCalled()
})

test('does not call second event handler if first prevents default', () => {
  const onClickA = vi.fn(event => event.preventDefault())
  const onClickB = vi.fn()
  const propsA = {onClick: onClickA}
  const propsB = {onClick: onClickB}
  const merged = mergeProps(propsA, propsB)
  merged.onClick(new MouseEvent('click', {cancelable: true}))

  expect(onClickA).toHaveBeenCalled()
  expect(onClickB).not.toHaveBeenCalled()
})

test('overrides event handler props when the existing value is not a function', () => {
  const onClick = vi.fn()
  const propsA = {onClick: undefined}
  const propsB = {onClick}
  const merged = mergeProps(propsA, propsB)

  merged.onClick(new MouseEvent('click'))

  expect(onClick).toHaveBeenCalled()
})

test('merges style', () => {
  const propsA = {style: {color: 'red'}}
  const propsB = {style: {backgroundColor: 'blue'}}
  const merged = mergeProps(propsA, propsB)

  expect(merged.style).toEqual({color: 'red', backgroundColor: 'blue'})
})

test('overrides non-mergeable props', () => {
  const propsA = {id: 'foo'}
  const propsB = {id: 'bar'}
  const merged = mergeProps(propsA, propsB)

  expect(merged.id).toBe('bar')
})

test('adds new props', () => {
  const propsA = {foo: 'foo'}
  const propsB = {bar: 'bar'}
  const merged = mergeProps(propsA, propsB)

  expect(merged.foo).toBe('foo')
  expect(merged.bar).toBe('bar')
})

test('merges multiple props', () => {
  const onClickA = vi.fn()
  const onClickB = vi.fn()
  const propsA = {className: 'foo', onClick: onClickA, style: {color: 'red'}}
  const propsB = {className: 'bar', onClick: onClickB, style: {backgroundColor: 'blue'}}
  const merged = mergeProps(propsA, propsB)
  merged.onClick(new MouseEvent('click'))

  expect(merged.className).toBe('foo bar')
  expect(merged.style).toEqual({color: 'red', backgroundColor: 'blue'})
  expect(onClickA).toHaveBeenCalled()
  expect(onClickB).toHaveBeenCalled()
})
