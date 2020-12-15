import React from 'react'
import ToastContainer from '../ToastContainer'
import {render, cleanup, screen} from '@testing-library/react'
import {renderHook, act} from '@testing-library/react-hooks'
import useToastsInternal from '../hooks/useToastsInternal'

jest.useFakeTimers()

describe('Toast', () => {
  it.skip('Renders a toast on the page when it is added by the hook', () => {
    render(<ToastContainer />)
    const {result} = renderHook(() => useToastsInternal())
    act(() => {
      result.current.addToast({
        message: 'Changes Saved',
        type: 'success',
      })
    })

    expect(screen.getByRole('status')).toHaveTextContent('Changes Saved')
    cleanup()
  })

  it.skip('Prevents dismissing the toast when focused inside of it', () => {})

  it.skip('Adds an action item to the toast', () => {})

  it.skip('Adds only one action item to the toast', () => {})
})

describe('useToastsInternal', () => {
  it('Adds a toast to the container with addToast from the hook', () => {
    const {result} = renderHook(() => useToastsInternal())
    expect(result.current.getToastProps().toasts).toEqual([])

    act(() => {
      result.current.addToast({
        message: 'Changes Saved',
        type: 'success',
      })
    })

    expect(result.current.getToastProps().toasts.length).toEqual(1)
  })

  it('Adds only one toast at a time to the container', () => {
    const {result} = renderHook(() => useToastsInternal())
    expect(result.current.getToastProps().toasts).toEqual([])

    act(() => {
      result.current.addToast({
        message: 'Changes Saved',
        type: 'success',
      })
    })

    expect(result.current.getToastProps().toasts.length).toEqual(1)

    act(() => {
      result.current.addToast({
        message: 'Changes Saved',
        type: 'success',
      })
    })

    expect(result.current.getToastProps().toasts.length).toEqual(1)
  })

  it('Respects autodismiss: false', () => {
    const {result} = renderHook(() => useToastsInternal({autoDismiss: false}))

    act(() => {
      result.current.addToast({
        message: 'Changes Saved',
        type: 'success',
      })
    })

    expect(result.current.getToastProps().toasts[0].timeoutId).toEqual(undefined)
  })

  it('Adds timeout to new toasts by default', () => {
    const {result} = renderHook(() => useToastsInternal())

    act(() => {
      result.current.addToast({
        message: 'Changes Saved',
        type: 'success',
      })
    })

    expect(result.current.getToastProps().toasts[0].timeoutId).not.toBeNull()
  })
})
