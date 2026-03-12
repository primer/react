import {render, renderHook} from '@testing-library/react'
import React, {forwardRef, type RefObject} from 'react'
import {describe, expect, it, vi} from 'vitest'
import {useCombinedRefs} from '../useCombinedRefs'

type InputOrButtonRef = RefObject<HTMLInputElement & HTMLButtonElement>

const Component = forwardRef<HTMLInputElement & HTMLButtonElement, {asButton?: boolean}>(({asButton}, forwardedRef) => {
  const ref: InputOrButtonRef = React.useRef(null)

  const combinedRef = useCombinedRefs(forwardedRef, ref)

  return asButton ? <button type="button" ref={combinedRef} /> : <input ref={combinedRef} />
})

describe('useCombinedRefs', () => {
  describe('combining a forwarded ref with an internal ref', () => {
    describe('object refs', () => {
      it('forwards the ref to the underlying element', async () => {
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

      it('does not call the ref on re-render if the target does not change', () => {
        const ref = vi.fn()

        const {rerender} = render(<Component ref={ref} />)

        rerender(<Component ref={ref} />)

        expect(ref).toHaveBeenCalledExactlyOnceWith(expect.any(HTMLInputElement))
      })
    })
  })

  describe('combining two callback refs', () => {
    it('calls both refs when the combined ref is called', () => {
      const refA = vi.fn()
      const refB = vi.fn()

      const combined = renderHook(() => useCombinedRefs(refA, refB))

      combined.result.current('test')
      expect(refA).toHaveBeenCalledExactlyOnceWith('test')
      expect(refB).toHaveBeenCalledExactlyOnceWith('test')
    })

    it('handles React 18 null values correctly', () => {
      const refA = vi.fn()
      const refB = vi.fn()

      const combined = renderHook(() => useCombinedRefs(refA, refB))

      combined.result.current('test')
      expect(refA).toHaveBeenCalledWith('test')
      expect(refB).toHaveBeenCalledWith('test')

      // on React 18, cleanup fn will be ignored and ref will be called with null
      combined.result.current(null)

      expect(refA).toHaveBeenCalledWith(null)
      expect(refB).toHaveBeenCalledWith(null)
    })

    it('handles React 19 cleanup functions correctly and independently', () => {
      const refA = vi.fn()
      const cleanupRefB = vi.fn()
      const refB = vi.fn().mockReturnValue(cleanupRefB)

      const combined = renderHook(() => useCombinedRefs(refA, refB))

      const cleanup = combined.result.current('test')
      expect(refA).toHaveBeenCalledWith('test')
      expect(refB).toHaveBeenCalledWith('test')

      // React 19 will call cleanup function and not pass null
      cleanup()

      expect(refA).toHaveBeenCalledWith(null)
      expect(refB).not.toHaveBeenCalledWith(null)
      expect(cleanupRefB).toHaveBeenCalledOnce()
    })
  })
})
