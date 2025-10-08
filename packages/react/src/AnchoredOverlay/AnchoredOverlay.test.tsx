import {act, useCallback, useState} from 'react'
import {describe, expect, it, vi} from 'vitest'
import {render} from '@testing-library/react'
import {userEvent} from '@vitest/browser/context'
import {AnchoredOverlay} from '../AnchoredOverlay'
import {Button} from '../Button'
import theme from '../theme'
import BaseStyles from '../BaseStyles'
import {ThemeProvider} from '../ThemeProvider'
import type {AnchorPosition} from '@primer/behaviors'
type TestComponentSettings = {
  initiallyOpen?: boolean
  onOpenCallback?: (gesture: string) => void
  onCloseCallback?: (gesture: string) => void
  onPositionChange?: ({position}: {position: AnchorPosition}) => void
}

const AnchoredOverlayTestComponent = ({
  initiallyOpen = false,
  onOpenCallback,
  onCloseCallback,
  onPositionChange,
}: TestComponentSettings = {}) => {
  const [open, setOpen] = useState(initiallyOpen)
  const onOpen = useCallback(
    (gesture: string) => {
      setOpen(true)
      onOpenCallback?.(gesture)
    },
    [onOpenCallback],
  )
  const onClose = useCallback(
    (gesture: string) => {
      setOpen(true)
      onCloseCallback?.(gesture)
    },
    [onCloseCallback],
  )
  return (
    <ThemeProvider theme={theme}>
      <BaseStyles>
        <AnchoredOverlay
          open={open}
          onOpen={onOpen}
          onClose={onClose}
          renderAnchor={props => <Button {...props}>Anchor Button</Button>}
          onPositionChange={onPositionChange}
        >
          <button type="button">Focusable Child</button>
        </AnchoredOverlay>
      </BaseStyles>
    </ThemeProvider>
  )
}

describe('AnchoredOverlay', () => {
  it('should call onOpen when the anchor is clicked', async () => {
    const mockOpenCallback = vi.fn()
    const mockCloseCallback = vi.fn()
    const anchoredOverlay = render(
      <AnchoredOverlayTestComponent onOpenCallback={mockOpenCallback} onCloseCallback={mockCloseCallback} />,
    )
    const anchor = anchoredOverlay.baseElement.querySelector('[aria-haspopup="true"]')!
    await act(async () => {
      await userEvent.click(anchor)
    })

    expect(mockOpenCallback).toHaveBeenCalledTimes(1)
    expect(mockOpenCallback).toHaveBeenCalledWith('anchor-click')
    expect(mockCloseCallback).toHaveBeenCalledTimes(0)
  })

  it('should call onOpen when the anchor activated by a key press', async () => {
    const mockOpenCallback = vi.fn()
    const mockCloseCallback = vi.fn()
    const anchoredOverlay = render(
      <AnchoredOverlayTestComponent onOpenCallback={mockOpenCallback} onCloseCallback={mockCloseCallback} />,
    )
    const anchor = anchoredOverlay.baseElement.querySelector('[aria-haspopup="true"]')!
    await act(async () => {
      await userEvent.type(anchor, '{Space}')
    })

    expect(mockOpenCallback).toHaveBeenCalledTimes(1)
    expect(mockOpenCallback).toHaveBeenCalledWith('anchor-key-press')
    expect(mockCloseCallback).toHaveBeenCalledTimes(0)
  })

  it('should call onClose when the user clicks off of the overlay', async () => {
    const mockOpenCallback = vi.fn()
    const mockCloseCallback = vi.fn()
    const anchoredOverlay = render(
      <AnchoredOverlayTestComponent
        initiallyOpen={true}
        onOpenCallback={mockOpenCallback}
        onCloseCallback={mockCloseCallback}
      />,
    )
    await act(async () => {
      await userEvent.click(anchoredOverlay.baseElement)
    })

    expect(mockOpenCallback).toHaveBeenCalledTimes(0)
    expect(mockCloseCallback).toHaveBeenCalledTimes(1)
    expect(mockCloseCallback).toHaveBeenCalledWith('click-outside')
  })

  it('should call onClose when the escape key is pressed', async () => {
    const mockOpenCallback = vi.fn()
    const mockCloseCallback = vi.fn()

    render(
      <AnchoredOverlayTestComponent
        initiallyOpen={true}
        onOpenCallback={mockOpenCallback}
        onCloseCallback={mockCloseCallback}
      />,
    )

    await act(async () => {
      await userEvent.keyboard('{Escape}')
    })

    expect(mockOpenCallback).toHaveBeenCalledTimes(0)
    expect(mockCloseCallback).toHaveBeenCalledTimes(1)
    expect(mockCloseCallback).toHaveBeenCalledWith('escape')
  })

  it.skip('should render consistently when open', () => {
    const {container} = render(<AnchoredOverlayTestComponent initiallyOpen={true} />)
    expect(container).toMatchSnapshot()
  })

  it('should call onPositionChange when provided', async () => {
    const mockPositionChangeCallback = vi.fn(({position}: {position: AnchorPosition}) => position)
    render(<AnchoredOverlayTestComponent initiallyOpen={true} onPositionChange={mockPositionChangeCallback} />)

    await act(async () => {
      await userEvent.keyboard('{Escape}')
    })

    expect(mockPositionChangeCallback).toHaveBeenCalled()
    expect(mockPositionChangeCallback).toHaveBeenCalledWith({
      position: {
        anchorAlign: 'start',
        anchorSide: 'outside-bottom',
        left: 0,
        top: 36,
      },
    })
  })
})
