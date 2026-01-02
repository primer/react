import {render, waitFor, act} from '@testing-library/react'
import {useRef, useState, useEffect, useImperativeHandle, forwardRef} from 'react'
import {describe, expect, test} from 'vitest'
import {useOverflow} from '../useOverflow'

interface TestHandle {
  setContainerHeight: (height: number) => void
}

const OverflowContainer = forwardRef<TestHandle, {onOverflowChange: (hasOverflow: boolean) => void}>(
  function OverflowContainer({onOverflowChange}, ref) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [containerHeight, setContainerHeight] = useState(200)
    const hasOverflow = useOverflow(containerRef)

    useEffect(() => {
      onOverflowChange(hasOverflow)
    }, [hasOverflow, onOverflowChange])

    useImperativeHandle(ref, () => ({
      setContainerHeight,
    }))

    return (
      <div ref={containerRef} style={{width: 100, height: containerHeight, overflow: 'auto'}}>
        <div style={{width: 50, height: 150}}>Content</div>
      </div>
    )
  },
)

describe('useOverflow', () => {
  test('returns false when element has no overflow', async () => {
    const results: boolean[] = []

    function TestComponent() {
      const ref = useRef<HTMLDivElement>(null)
      const hasOverflow = useOverflow(ref)

      useEffect(() => {
        results.push(hasOverflow)
      }, [hasOverflow])

      return (
        <div ref={ref} style={{width: 100, height: 100, overflow: 'auto'}}>
          <div style={{width: 50, height: 50}}>Small content</div>
        </div>
      )
    }

    render(<TestComponent />)

    await waitFor(() => {
      expect(results.length).toBeGreaterThan(0)
    })

    expect(results[results.length - 1]).toBe(false)
  })

  test('returns true when element has vertical overflow', async () => {
    const results: boolean[] = []

    function TestComponent() {
      const ref = useRef<HTMLDivElement>(null)
      const hasOverflow = useOverflow(ref)

      useEffect(() => {
        results.push(hasOverflow)
      }, [hasOverflow])

      return (
        <div ref={ref} style={{width: 100, height: 100, overflow: 'auto'}}>
          <div style={{width: 50, height: 200}}>Tall content</div>
        </div>
      )
    }

    render(<TestComponent />)

    await waitFor(() => {
      expect(results).toContain(true)
    })
  })

  test('returns true when element has horizontal overflow', async () => {
    const results: boolean[] = []

    function TestComponent() {
      const ref = useRef<HTMLDivElement>(null)
      const hasOverflow = useOverflow(ref)

      useEffect(() => {
        results.push(hasOverflow)
      }, [hasOverflow])

      return (
        <div ref={ref} style={{width: 100, height: 100, overflow: 'auto'}}>
          <div style={{width: 200, height: 50, whiteSpace: 'nowrap'}}>Wide content</div>
        </div>
      )
    }

    render(<TestComponent />)

    await waitFor(() => {
      expect(results).toContain(true)
    })
  })

  test('returns false when ref.current is null', async () => {
    const results: boolean[] = []

    function TestComponent() {
      const ref = useRef<HTMLDivElement>(null)
      const hasOverflow = useOverflow(ref)

      useEffect(() => {
        results.push(hasOverflow)
      }, [hasOverflow])

      return null
    }

    render(<TestComponent />)

    await waitFor(() => {
      expect(results.length).toBeGreaterThan(0)
    })

    expect(results[0]).toBe(false)
  })

  test('updates when overflow state changes', async () => {
    const results: boolean[] = []
    const handleRef = {current: null as TestHandle | null}

    function TestComponent() {
      const ref = useRef<TestHandle>(null)

      useEffect(() => {
        handleRef.current = ref.current
      })

      return (
        <OverflowContainer
          ref={ref}
          onOverflowChange={hasOverflow => {
            results.push(hasOverflow)
          }}
        />
      )
    }

    render(<TestComponent />)

    // Initially containerHeight=200, content height=150, so no overflow
    await waitFor(() => {
      expect(results).toContain(false)
    })

    // Shrink container to 100px, content is 150px, so overflow should be true
    await act(async () => {
      handleRef.current?.setContainerHeight(100)
    })

    await waitFor(() => {
      expect(results).toContain(true)
    })
  })
})
