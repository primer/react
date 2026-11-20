import React from 'react'
import {act, fireEvent, render, screen, waitFor} from '@testing-library/react'
import {createPortal} from 'react-dom'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {TableBulkActions} from '../TableBulkActions'

describe('TableBulkActions focus observer', () => {
  let liveRegion: HTMLElement

  beforeEach(() => {
    liveRegion = document.createElement('live-region')
    document.body.appendChild(liveRegion)
  })

  afterEach(() => {
    liveRegion.remove()
  })

  it.each([false, true])('uses the latest callback without observing again (portal: %s)', async portal => {
    const observe = vi.spyOn(MutationObserver.prototype, 'observe')
    const previous = vi.fn()
    const current = vi.fn()

    function Action() {
      const [visible, setVisible] = React.useState(true)
      const button = visible ? (
        <button type="button" autoFocus onClick={() => setVisible(false)}>
          Remove action
        </button>
      ) : null
      return portal ? createPortal(button, document.body) : button
    }

    function example(onFocusReturn: () => void) {
      return (
        <React.StrictMode>
          <TableBulkActions selectedCount={1} onFocusReturn={onFocusReturn}>
            <Action />
          </TableBulkActions>
        </React.StrictMode>
      )
    }

    let view: ReturnType<typeof render> | undefined
    try {
      view = render(example(previous))
      const action = screen.getByRole('button', {name: 'Remove action'})
      expect(action).toHaveFocus()
      const bodyObservations = () => observe.mock.calls.filter(([target]) => target === document.body).length
      const initialObservations = bodyObservations()
      expect(initialObservations).toBeGreaterThan(0)

      view.rerender(example(current))
      expect(bodyObservations()).toBe(initialObservations)

      fireEvent.click(action)
      await waitFor(() => expect(current).toHaveBeenCalledOnce())
      expect(previous).not.toHaveBeenCalled()
    } finally {
      view?.unmount()
      observe.mockRestore()
    }
  })

  it('disconnects the document observer when unmounted', () => {
    const observe = vi.spyOn(MutationObserver.prototype, 'observe')
    const disconnect = vi.spyOn(MutationObserver.prototype, 'disconnect')
    try {
      const view = render(
        <TableBulkActions selectedCount={1}>
          <button type="button">Action</button>
        </TableBulkActions>,
      )

      act(() => screen.getByRole('button', {name: 'Action'}).focus())
      const bodyIndex = observe.mock.calls.findLastIndex(([target]) => target === document.body)
      expect(bodyIndex).toBeGreaterThanOrEqual(0)
      const bodyObserver = observe.mock.contexts[bodyIndex]

      view.unmount()
      expect(disconnect.mock.contexts).toContain(bodyObserver)
    } finally {
      observe.mockRestore()
      disconnect.mockRestore()
    }
  })
})
