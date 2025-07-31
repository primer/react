import type React from 'react'
import {render} from '@testing-library/react'
import {describe, expect, test} from 'vitest'
import FormControl, {useFormControlForwardedProps} from '../../FormControl'

describe('useFormControlForwardedProps', () => {
  describe('when used outside FormControl', () => {
    test('returns empty object when no props object passed', () => {
      const calls: Array<ReturnType<typeof useFormControlForwardedProps>> = []

      function TestComponent() {
        const props = useFormControlForwardedProps({})
        calls.push(props)
        return null
      }

      render(<TestComponent />)

      expect(calls[0]).toEqual({})
    })

    test('returns passed props object instance when passed', () => {
      const props = {id: 'test-id'}
      const calls: Array<ReturnType<typeof useFormControlForwardedProps>> = []

      function TestComponent() {
        calls.push(useFormControlForwardedProps(props))
        return null
      }

      render(<TestComponent />)

      expect(calls[0]).toBe(props)
    })
  })

  test('provides context value when no props object is passed', () => {
    const id = 'test-id'
    const calls: Array<ReturnType<typeof useFormControlForwardedProps>> = []

    function TestComponent() {
      calls.push(useFormControlForwardedProps({}))
      return null
    }

    render(
      <FormControl id={id} disabled required>
        <FormControl.Label>Label</FormControl.Label>
        <TestComponent />
      </FormControl>,
    )

    expect(calls[0].disabled).toBe(true)
    expect(calls[0].id).toBe(id)
    expect(calls[0].required).toBe(true)
  })

  test('merges with props object, overriding to prioritize props when conflicting', () => {
    const props = {id: 'override-id', xyz: 'someValue'}
    const calls: Array<ReturnType<typeof useFormControlForwardedProps> & typeof props> = []

    function TestComponent() {
      calls.push(useFormControlForwardedProps(props))
      return null
    }

    render(
      <FormControl id="form-control-id" disabled>
        <FormControl.Label>Label</FormControl.Label>
        <TestComponent />
      </FormControl>,
    )

    expect(calls[0].disabled).toBe(true)
    expect(calls[0].id).toBe(props.id)
    expect(calls[0].required).toBeFalsy()
    expect(calls[0].xyz).toBe(props.xyz)
  })
})
