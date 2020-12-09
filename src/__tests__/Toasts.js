import React from 'react'
import {ToastContainer} from '..'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('Toasts', () => {
  behavesAsComponent(ToastContainer, [COMMON])

  checkExports('ToastContainer', {
    default: ToastContainer,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<ToastContainer />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it.skip('Adds a toast to the container with addToast from the hook', () => {})

  it.skip('Adds only one toast at a time to the container', () => {})

  it.skip('Respects autodismiss: false', () => {})

  it.skip('Respects custom timing prop', () => {})

  it.skip('Focuses the action item when pressing control + t', () => {})

  it.skip('Prevents dismissing the toast when focused inside of it', () => {})

  it.skip('Adds an action item to the toast', () => {})

  it.skip('Adds only one action item to the toast', () => {})
})
