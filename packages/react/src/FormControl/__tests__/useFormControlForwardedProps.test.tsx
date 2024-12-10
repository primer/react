import React from 'react'
import {renderHook} from '@testing-library/react-hooks'
import FormControl, {useFormControlForwardedProps} from '../../FormControl'

describe('useFormControlForwardedProps', () => {
  describe('when used outside FormControl', () => {
    test('returns empty object when no props object passed', () => {
      const result = renderHook(() => useFormControlForwardedProps({}))
      expect(result.result.current).toEqual({})
    })

    test('returns passed props object instance when passed', () => {
      const props = {id: 'test-id'}
      const result = renderHook(() => useFormControlForwardedProps(props))
      expect(result.result.current).toBe(props)
    })
  })

  test('provides context value when no props object is passed', () => {
    const id = 'test-id'

    const {result} = renderHook(() => useFormControlForwardedProps({}), {
      wrapper: ({children}: {children: React.ReactNode}) => (
        <FormControl id={id} disabled required>
          <FormControl.Label>Label</FormControl.Label>
          {children}
        </FormControl>
      ),
    })

    expect(result.current.disabled).toBe(true)
    expect(result.current.id).toBe(id)
    expect(result.current.required).toBe(true)
  })

  test('merges with props object, overriding to prioritize props when conflicting', () => {
    const props = {id: 'override-id', xyz: 'someValue'}

    const {result} = renderHook(() => useFormControlForwardedProps(props), {
      wrapper: ({children}: {children: React.ReactNode}) => (
        <FormControl id="form-control-id" disabled>
          <FormControl.Label>Label</FormControl.Label>
          {children}
        </FormControl>
      ),
    })

    expect(result.current.disabled).toBe(true)
    expect(result.current.id).toBe(props.id)
    expect(result.current.required).toBeFalsy()
    expect(result.current.xyz).toBe(props.xyz)
  })
})
