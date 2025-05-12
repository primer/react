import {useCallback, useState} from 'react'
import {describe, expect, it, vi} from 'vitest'
import {render, fireEvent} from '@testing-library/react'
import {AnchoredOverlay} from '../AnchoredOverlay'
import {Button} from '../Button'
import theme from '../theme'
import BaseStyles from '../BaseStyles'
import {ThemeProvider} from '../ThemeProvider'

type TestComponentSettings = {
  initiallyOpen?: boolean
  onOpenCallback?: (gesture: string) => void
  onCloseCallback?: (gesture: string) => void
}

const AnchoredOverlayTestComponent = ({
  initiallyOpen = false,
  onOpenCallback,
  onCloseCallback,
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
        >
          <button type="button">Focusable Child</button>
        </AnchoredOverlay>
      </BaseStyles>
    </ThemeProvider>
  )
}

describe('AnchoredOverlay', () => {
  it('should call onOpen when the anchor is clicked', () => {
    const mockOpenCallback = vi.fn()
    const mockCloseCallback = vi.fn()
    const anchoredOverlay = render(
      <AnchoredOverlayTestComponent onOpenCallback={mockOpenCallback} onCloseCallback={mockCloseCallback} />,
    )
    const anchor = anchoredOverlay.baseElement.querySelector('[aria-haspopup="true"]')!
    fireEvent.click(anchor)

    expect(mockOpenCallback).toHaveBeenCalledTimes(1)
    expect(mockOpenCallback).toHaveBeenCalledWith('anchor-click')
    expect(mockCloseCallback).toHaveBeenCalledTimes(0)
  })

  it('should call onOpen when the anchor activated by a key press', () => {
    const mockOpenCallback = vi.fn()
    const mockCloseCallback = vi.fn()
    const anchoredOverlay = render(
      <AnchoredOverlayTestComponent onOpenCallback={mockOpenCallback} onCloseCallback={mockCloseCallback} />,
    )
    const anchor = anchoredOverlay.baseElement.querySelector('[aria-haspopup="true"]')!
    fireEvent.keyDown(anchor, {key: ' '})

    expect(mockOpenCallback).toHaveBeenCalledTimes(1)
    expect(mockOpenCallback).toHaveBeenCalledWith('anchor-key-press')
    expect(mockCloseCallback).toHaveBeenCalledTimes(0)
  })

  it('should call onClose when the user clicks off of the overlay', () => {
    const mockOpenCallback = vi.fn()
    const mockCloseCallback = vi.fn()
    const anchoredOverlay = render(
      <AnchoredOverlayTestComponent
        initiallyOpen={true}
        onOpenCallback={mockOpenCallback}
        onCloseCallback={mockCloseCallback}
      />,
    )
    fireEvent.mouseDown(anchoredOverlay.baseElement)

    expect(mockOpenCallback).toHaveBeenCalledTimes(0)
    expect(mockCloseCallback).toHaveBeenCalledTimes(1)
    expect(mockCloseCallback).toHaveBeenCalledWith('click-outside')
  })

  it('should call onClose when the escape key is pressed', async () => {
    const mockOpenCallback = vi.fn()
    const mockCloseCallback = vi.fn()
    const anchoredOverlay = render(
      <AnchoredOverlayTestComponent
        initiallyOpen={true}
        onOpenCallback={mockOpenCallback}
        onCloseCallback={mockCloseCallback}
      />,
    )
    const overlay = await anchoredOverlay.findByRole('none')
    fireEvent.keyDown(overlay, {key: 'Escape'})

    expect(mockOpenCallback).toHaveBeenCalledTimes(0)
    expect(mockCloseCallback).toHaveBeenCalledTimes(1)
    expect(mockCloseCallback).toHaveBeenCalledWith('escape')
  })

  it('should render consistently when open', () => {
    const {container} = render(<AnchoredOverlayTestComponent initiallyOpen={true} />)
    expect(container).toMatchSnapshot()
  })
})
