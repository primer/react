import {act, render, waitFor} from '@testing-library/react'
import {useRef} from 'react'
import {expect, it, vi} from 'vitest'
import {useScrollAnchor} from '../../hooks/useScrollAnchor'

function ScrollRegion({getAnchorTop, anchorVersion = 'initial'}: {getAnchorTop: () => number; anchorVersion?: string}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)

  useScrollAnchor({containerRef, anchorRef})

  return (
    <div ref={containerRef}>
      <div
        key={anchorVersion}
        ref={node => {
          anchorRef.current = node
          if (node) {
            vi.spyOn(node, 'getBoundingClientRect').mockImplementation(() => new DOMRect(0, getAnchorTop(), 100, 20))
          }
        }}
        data-testid="anchor"
      />
    </div>
  )
}

it('preserves the anchor position when content changes above it', async () => {
  const anchor = {top: 300}
  const scrollBy = vi.spyOn(window, 'scrollBy').mockImplementation((_x, y) => {
    anchor.top -= y
  })

  const {container} = render(<ScrollRegion getAnchorTop={() => anchor.top} />)

  await act(async () => {
    container.firstElementChild?.prepend(document.createElement('div'))
    anchor.top += 48
  })

  await waitFor(() => {
    expect(scrollBy).toHaveBeenCalledWith(0, 48)
  })
  expect(anchor.top).toBe(300)

  scrollBy.mockRestore()
})

it('uses the latest anchor position after the user scrolls', async () => {
  const anchor = {top: 300}
  const scrollBy = vi.spyOn(window, 'scrollBy').mockImplementation((_x, y) => {
    anchor.top -= y
  })

  const {container} = render(<ScrollRegion getAnchorTop={() => anchor.top} />)

  anchor.top = 240
  act(() => {
    window.dispatchEvent(new Event('scroll'))
  })

  await act(async () => {
    container.firstElementChild?.prepend(document.createElement('div'))
    anchor.top += 20
  })

  await waitFor(() => {
    expect(scrollBy).toHaveBeenCalledWith(0, 20)
  })
  expect(anchor.top).toBe(240)

  scrollBy.mockRestore()
})

it('does not adjust scroll when the anchor position is unchanged', async () => {
  const scrollBy = vi.spyOn(window, 'scrollBy')
  const {container} = render(<ScrollRegion getAnchorTop={() => 0} />)

  await act(async () => {
    container.firstElementChild?.prepend(document.createElement('div'))
  })

  await waitFor(() => {
    expect(container.firstElementChild?.children).toHaveLength(2)
  })
  expect(scrollBy).not.toHaveBeenCalled()

  scrollBy.mockRestore()
})

it('preserves the position when the anchor element is replaced', async () => {
  const anchor = {top: 300}
  const scrollBy = vi.spyOn(window, 'scrollBy').mockImplementation((_x, y) => {
    anchor.top -= y
  })

  const {rerender} = render(<ScrollRegion getAnchorTop={() => anchor.top} />)
  anchor.top += 32
  rerender(<ScrollRegion getAnchorTop={() => anchor.top} anchorVersion="updated" />)

  await waitFor(() => {
    expect(scrollBy).toHaveBeenCalledWith(0, 32)
  })
  expect(anchor.top).toBe(300)

  scrollBy.mockRestore()
})
