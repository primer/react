import {act, render, waitFor} from '@testing-library/react'
import {useCallback, useState} from 'react'
import {expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import {useScrollAnchor} from '../../hooks/useScrollAnchor'

function ScrollRegion({
  getAnchorTop,
  anchorVersion = 'initial',
  mounted = true,
  anchorKey,
  containerVersion = 'initial',
}: {
  getAnchorTop: () => number
  anchorVersion?: string
  mounted?: boolean
  anchorKey?: string
  containerVersion?: string
}) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const [anchor, setAnchor] = useState<HTMLDivElement | null>(null)
  const anchorRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        vi.spyOn(node, 'getBoundingClientRect').mockImplementation(() => new DOMRect(0, getAnchorTop(), 100, 20))
      }
      setAnchor(node)
    },
    [getAnchorTop],
  )

  useScrollAnchor({container, anchor, anchorKey})

  return mounted ? (
    <div key={containerVersion} ref={setContainer} data-testid="container">
      <div key={anchorVersion} ref={anchorRef} data-testid="anchor" />
    </div>
  ) : null
}

it('preserves the anchor position when content changes above it', async () => {
  const anchor = {top: 300}
  const scrollBy = vi.spyOn(window, 'scrollBy').mockImplementation(() => {
    anchor.top = 300
  })

  const {container} = render(<ScrollRegion getAnchorTop={() => anchor.top} />)

  await act(async () => {
    container.firstElementChild?.prepend(document.createElement('div'))
    anchor.top += 48
  })

  await waitFor(() => {
    expect(scrollBy).toHaveBeenCalledWith({top: 48, behavior: 'instant'})
  })
  expect(anchor.top).toBe(300)
  scrollBy.mockRestore()
})

it('uses the latest anchor position after the user scrolls', async () => {
  const anchor = {top: 300}
  const scrollBy = vi.spyOn(window, 'scrollBy').mockImplementation(() => {
    anchor.top = 240
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
    expect(scrollBy).toHaveBeenCalledWith({top: 20, behavior: 'instant'})
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
  expect(scrollBy).not.toHaveBeenCalled()
  scrollBy.mockRestore()
})

it('starts observing when the container and anchor mount later and when the container changes', async () => {
  const anchor = {top: 300}
  const getAnchorTop = () => anchor.top
  const scrollBy = vi.spyOn(window, 'scrollBy').mockImplementation(() => {
    anchor.top = 300
  })
  const {container, rerender} = render(<ScrollRegion getAnchorTop={getAnchorTop} mounted={false} />)
  rerender(<ScrollRegion getAnchorTop={getAnchorTop} />)

  await act(async () => {
    container.firstElementChild?.prepend(document.createElement('div'))
    anchor.top += 20
  })
  expect(scrollBy).toHaveBeenCalledWith({top: 20, behavior: 'instant'})

  scrollBy.mockClear()
  rerender(<ScrollRegion getAnchorTop={getAnchorTop} containerVersion="replacement" />)
  await act(async () => {
    container.firstElementChild?.prepend(document.createElement('div'))
    anchor.top += 30
  })
  expect(scrollBy).toHaveBeenCalledWith({top: 30, behavior: 'instant'})
  scrollBy.mockRestore()
})

function NestedMount({getAnchorTop}: {getAnchorTop: () => number}) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const [anchor, setAnchor] = useState<HTMLDivElement | null>(null)
  const anchorRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        vi.spyOn(node, 'getBoundingClientRect').mockImplementation(() => new DOMRect(0, getAnchorTop(), 100, 20))
      }
      setAnchor(node)
    },
    [getAnchorTop],
  )
  useScrollAnchor({container, anchor})
  return <NestedMountContent containerRef={setContainer} anchorRef={anchorRef} />
}

function NestedMountContent({
  containerRef,
  anchorRef,
}: {
  containerRef: (element: HTMLDivElement | null) => void
  anchorRef: (element: HTMLDivElement | null) => void
}) {
  const [stage, setStage] = useState(0)
  return (
    <>
      <button type="button" onClick={() => setStage(value => value + 1)}>
        {stage === 0 ? 'Mount timeline' : 'Mount anchor'}
      </button>
      {stage > 0 && (
        <div ref={containerRef} data-testid="late-container">
          {stage > 1 && <div ref={anchorRef} />}
        </div>
      )}
    </>
  )
}

it('observes nodes mounted by a child after the hook first renders', async () => {
  const anchor = {top: 300}
  const scrollBy = vi.spyOn(window, 'scrollBy').mockImplementation(() => {
    anchor.top = 300
  })
  const {getByTestId} = render(<NestedMount getAnchorTop={() => anchor.top} />)

  await userEvent.click(page.getByRole('button', {name: 'Mount timeline'}))
  await userEvent.click(page.getByRole('button', {name: 'Mount anchor'}))
  await act(async () => {
    getByTestId('late-container').prepend(document.createElement('div'))
    anchor.top += 25
  })

  expect(scrollBy).toHaveBeenCalledWith({top: 25, behavior: 'instant'})
  scrollBy.mockRestore()
})

it('preserves the position when the same keyed anchor element is replaced', async () => {
  const anchor = {top: 300}
  const getAnchorTop = () => anchor.top
  const scrollBy = vi.spyOn(window, 'scrollBy').mockImplementation(() => {
    anchor.top = 300
  })
  const {rerender} = render(<ScrollRegion getAnchorTop={getAnchorTop} anchorKey="comment" />)

  anchor.top += 32
  rerender(<ScrollRegion getAnchorTop={getAnchorTop} anchorKey="comment" anchorVersion="updated" />)

  await waitFor(() => {
    expect(scrollBy).toHaveBeenCalledWith({top: 32, behavior: 'instant'})
  })
  expect(anchor.top).toBe(300)
  scrollBy.mockRestore()
})

function SelectableAnchors({selected}: {selected: 'first' | 'second'}) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const [first, setFirst] = useState<HTMLDivElement | null>(null)
  const [second, setSecond] = useState<HTMLDivElement | null>(null)
  useScrollAnchor({container, anchor: selected === 'first' ? first : second})

  return (
    <div ref={setContainer}>
      <div ref={setFirst} style={{height: 100}} />
      <div ref={setSecond} />
    </div>
  )
}

it('starts a new baseline when selecting another mounted anchor', async () => {
  const scrollBy = vi.spyOn(window, 'scrollBy')
  const {container, rerender} = render(<SelectableAnchors selected="first" />)
  rerender(<SelectableAnchors selected="second" />)

  await act(async () => {
    container.firstElementChild?.setAttribute('data-updated', 'true')
  })
  expect(scrollBy).not.toHaveBeenCalled()
  scrollBy.mockRestore()
})

it('starts a new baseline when an element is reused for a different anchor key', async () => {
  const anchor = {top: 100}
  const getAnchorTop = () => anchor.top
  const scrollBy = vi.spyOn(window, 'scrollBy')
  const {container, rerender} = render(<ScrollRegion getAnchorTop={getAnchorTop} anchorKey="first" />)

  anchor.top = 300
  rerender(<ScrollRegion getAnchorTop={getAnchorTop} anchorKey="second" />)
  await act(async () => {
    container.firstElementChild?.setAttribute('data-updated', 'true')
  })

  expect(scrollBy).not.toHaveBeenCalled()
  scrollBy.mockRestore()
})

function RealScrollRegion() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const [anchor, setAnchor] = useState<HTMLDivElement | null>(null)
  useScrollAnchor({container, anchor})
  return (
    <div ref={setContainer} style={{height: 2500}}>
      <div data-testid="growing-content" style={{height: 600}} />
      <div ref={setAnchor} data-testid="anchor" style={{height: 100}}>
        Anchor
      </div>
      <div style={{height: 1800}} />
    </div>
  )
}

it('does not double-correct when the browser provides native scroll anchoring', async () => {
  const previousAnchor = document.documentElement.style.overflowAnchor
  document.documentElement.style.overflowAnchor = 'auto'
  try {
    const {getByTestId} = render(<RealScrollRegion />)
    const anchor = getByTestId('anchor')
    await new Promise<void>(resolve => {
      // eslint-disable-next-line github/prefer-observers -- Wait until the hook has captured the programmatic scroll.
      window.addEventListener('scroll', () => resolve(), {once: true})
      window.scrollTo({top: 400, behavior: 'instant'})
    })
    const top = anchor.getBoundingClientRect().top

    getByTestId('growing-content').style.height = '700px'
    await expect.poll(() => window.scrollY).toBe(500)
    expect(Math.abs(anchor.getBoundingClientRect().top - top)).toBeLessThan(1)
  } finally {
    document.documentElement.style.overflowAnchor = previousAnchor
    window.scrollTo({top: 0, behavior: 'instant'})
  }
})

it('preserves position after layout-only growth, using instant scrolling even with smooth scrolling enabled', async () => {
  const previousAnchor = document.documentElement.style.overflowAnchor
  const previousBehavior = document.documentElement.style.scrollBehavior
  document.documentElement.style.overflowAnchor = 'none'
  document.documentElement.style.scrollBehavior = 'smooth'
  const scrollBy = vi.spyOn(window, 'scrollBy')
  const stylesheet = document.createElement('style')

  try {
    const {getByTestId} = render(<RealScrollRegion />)
    const anchor = getByTestId('anchor')
    await new Promise<void>(resolve => {
      // eslint-disable-next-line github/prefer-observers -- Wait until the hook has captured the programmatic scroll.
      window.addEventListener('scroll', () => resolve(), {once: true})
      window.scrollTo({top: 400, behavior: 'instant'})
    })
    const top = anchor.getBoundingClientRect().top

    stylesheet.textContent = '[data-testid="growing-content"] { height: 700px !important; }'
    document.head.append(stylesheet)
    await expect.poll(() => Math.abs(anchor.getBoundingClientRect().top - top)).toBeLessThan(1)
    expect(scrollBy).toHaveBeenCalledWith({top: 100, behavior: 'instant'})
  } finally {
    stylesheet.remove()
    scrollBy.mockRestore()
    document.documentElement.style.overflowAnchor = previousAnchor
    document.documentElement.style.scrollBehavior = previousBehavior
    window.scrollTo({top: 0, behavior: 'instant'})
  }
})

it('updates the baseline when a correction is clamped at the top of the page', async () => {
  const previousAnchor = document.documentElement.style.overflowAnchor
  document.documentElement.style.overflowAnchor = 'none'
  window.scrollTo({top: 0, behavior: 'instant'})
  const scrollBy = vi.spyOn(window, 'scrollBy')

  try {
    const {getByTestId} = render(<RealScrollRegion />)
    const anchor = getByTestId('anchor')
    const content = getByTestId('growing-content')

    content.style.height = '500px'
    await expect.poll(() => scrollBy.mock.calls.length).toBeGreaterThan(0)
    expect(window.scrollY).toBe(0)
    const top = anchor.getBoundingClientRect().top

    content.style.height = '600px'
    await expect.poll(() => Math.abs(anchor.getBoundingClientRect().top - top)).toBeLessThan(1)
    expect(window.scrollY).toBe(100)
  } finally {
    scrollBy.mockRestore()
    document.documentElement.style.overflowAnchor = previousAnchor
    window.scrollTo({top: 0, behavior: 'instant'})
  }
})
