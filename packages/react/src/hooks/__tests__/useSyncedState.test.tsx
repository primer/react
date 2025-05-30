import {act, renderHook} from '@testing-library/react'
import {test, expect} from 'vitest'
import {useSyncedState} from '../useSyncedState'

const renderUseSyncedState = (
  initialValue: string | (() => string),
  {isPropUpdateDisabled}: {isPropUpdateDisabled: boolean} = {isPropUpdateDisabled: false},
) => {
  return renderHook(props => useSyncedState(props.initialValue, {isPropUpdateDisabled: props.isPropUpdateDisabled}), {
    initialProps: {
      initialValue,
      isPropUpdateDisabled,
    },
  })
}
test('it renders a default', () => {
  const {result} = renderUseSyncedState('default')
  expect(result.current[0]).toEqual('default')
})

test('it updates state from the internal state setter', () => {
  const {result} = renderUseSyncedState('default')
  expect(result.current[0]).toEqual('default')
  act(() => {
    result.current[1]('new value')
  })
  expect(result.current[0]).toEqual('new value')
})

test('it updates state from the internal state setter with an updater fn', () => {
  const {result} = renderUseSyncedState('default')
  expect(result.current[0]).toEqual('default')
  act(() => {
    result.current[1](prev => `${prev} new value`)
  })
  expect(result.current[0]).toEqual('default new value')
})

test('it updates state from the external state setter', () => {
  const {result, rerender} = renderUseSyncedState('default')
  expect(result.current[0]).toEqual('default')

  rerender({initialValue: 'new value', isPropUpdateDisabled: false})

  expect(result.current[0]).toEqual('new value')
})

test('it properly handles init functions', () => {
  const {result, rerender} = renderUseSyncedState(() => 'default')
  expect(result.current[0]).toEqual('default')

  rerender({initialValue: () => 'new value', isPropUpdateDisabled: false})

  expect(result.current[0]).toEqual('new value')
})

test('it does not update from props if disabled', () => {
  const {result, rerender} = renderUseSyncedState('default', {isPropUpdateDisabled: true})
  expect(result.current[0]).toEqual('default')

  rerender({initialValue: 'new value', isPropUpdateDisabled: true})

  expect(result.current[0]).toEqual('default')
})
