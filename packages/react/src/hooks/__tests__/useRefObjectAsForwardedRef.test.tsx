import {render} from '@testing-library/react'
import React, {forwardRef, type RefObject} from 'react'
import {describe, expect, it, vi} from 'vitest'
import {useRefObjectAsForwardedRef} from '../useRefObjectAsForwardedRef'

type InputOrButtonRef = RefObject<HTMLInputElement & HTMLButtonElement>

const Component = forwardRef<HTMLInputElement & HTMLButtonElement, {asButton?: boolean}>(({asButton}, forwardedRef) => {
  const ref: InputOrButtonRef = React.useRef(null)

  useRefObjectAsForwardedRef(forwardedRef, ref)

  return asButton ? <button type="button" ref={ref} /> : <input ref={ref} />
})

describe('useRefObjectAsForwardedRef', () => {
  describe('object refs', () => {
    it('fowards the ref to the underlying element', async () => {
      const ref: InputOrButtonRef = {current: null}

      render(<Component ref={ref} />)

      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })

    it('avoids dangling references by clearing the ref on unmount', () => {
      const ref: InputOrButtonRef = {current: null}

      const {unmount} = render(<Component ref={ref} />)

      expect(ref.current).toBeInstanceOf(HTMLInputElement)

      unmount()

      expect(ref.current).toBeNull()
    })

    it('updates the ref if the target changes', () => {
      const ref: InputOrButtonRef = {current: null}

      const {rerender} = render(<Component ref={ref} />)

      expect(ref.current).toBeInstanceOf(HTMLInputElement)

      rerender(<Component ref={ref} asButton />)

      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })

    it('is correctly set during an initial effect', () => {
      // This can break if the hook delays setting the initial value until a subsequent render

      const ComponentWithEffect = () => {
        const ref = React.useRef<HTMLInputElement & HTMLButtonElement>(null)

        React.useEffect(() => {
          expect(ref.current).toBeInstanceOf(HTMLInputElement)
        }, [])

        return <Component ref={ref} />
      }

      render(<ComponentWithEffect />)
    })
  })

  describe('callback refs', () => {
    it('calls the ref on mount and unmount', async () => {
      const ref = vi.fn()

      const {unmount} = render(<Component ref={ref} />)

      expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement))

      unmount()

      expect(ref).toHaveBeenCalledWith(null)
    })

    it('calls the ref if the target changes', () => {
      const ref = vi.fn()

      const {rerender} = render(<Component ref={ref} />)

      expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement))

      rerender(<Component ref={ref} asButton />)

      expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement))
    })

    // Known issue: The ref is called on every render, even if the target does not change
    it.todo('does not call the ref on re-render if the target does not change', () => {
      const ref = vi.fn()

      const {rerender} = render(<Component ref={ref} />)

      rerender(<Component ref={ref} />)

      expect(ref).toHaveBeenCalledExactlyOnceWith(expect.any(HTMLInputElement))
    })
  })
})
