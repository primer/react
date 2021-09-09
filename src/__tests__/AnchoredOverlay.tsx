import React, {useCallback, useState} from 'react'
import {AnchoredOverlay} from '../AnchoredOverlay'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender, cleanup, fireEvent} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
import {Button, SSRProvider} from '../index'
import theme from '../theme'
import BaseStyles from '../BaseStyles'
import {ThemeProvider} from '../ThemeProvider'
expect.extend(toHaveNoViolations)

type TestComponentSettings = {
  initiallyOpen?: boolean
  onOpenCallback?: (gesture: string) => void
  onCloseCallback?: (gesture: string) => void
}

const AnchoredOverlayTestComponent = ({
  initiallyOpen = false,
  onOpenCallback,
  onCloseCallback
}: TestComponentSettings = {}) => {
  const [open, setOpen] = useState(initiallyOpen)
  const onOpen = useCallback(
    (gesture: string) => {
      setOpen(true)
      onOpenCallback?.(gesture)
    },
    [onOpenCallback]
  )
  const onClose = useCallback(
    (gesture: string) => {
      setOpen(true)
      onCloseCallback?.(gesture)
    },
    [onCloseCallback]
  )
  return (
    <ThemeProvider theme={theme}>
      <SSRProvider>
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
      </SSRProvider>
    </ThemeProvider>
  )
}

describe('AnchoredOverlay', () => {
  behavesAsComponent({
    Component: AnchoredOverlay,
    systemPropArray: [],
    options: {skipAs: true, skipSx: true},
    toRender: () => <AnchoredOverlayTestComponent />
  })

  checkExports('AnchoredOverlay', {
    default: undefined,
    AnchoredOverlay
  })

  it('should have no axe violations when open', async () => {
    const {container} = HTMLRender(<AnchoredOverlayTestComponent initiallyOpen={true}></AnchoredOverlayTestComponent>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('should have no axe violations when closed', async () => {
    const {container} = HTMLRender(<AnchoredOverlayTestComponent></AnchoredOverlayTestComponent>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('should call onOpen when the anchor is clicked', () => {
    const mockOpenCallback = jest.fn()
    const mockCloseCallback = jest.fn()
    const anchoredOverlay = HTMLRender(
      <AnchoredOverlayTestComponent onOpenCallback={mockOpenCallback} onCloseCallback={mockCloseCallback} />
    )
    const anchor = anchoredOverlay.baseElement.querySelector('[aria-haspopup="true"]')!
    fireEvent.click(anchor)

    expect(mockOpenCallback).toHaveBeenCalledTimes(1)
    expect(mockOpenCallback).toHaveBeenCalledWith('anchor-click')
    expect(mockCloseCallback).toHaveBeenCalledTimes(0)
  })

  it('should call onOpen when the anchor activated by a key press', () => {
    const mockOpenCallback = jest.fn()
    const mockCloseCallback = jest.fn()
    const anchoredOverlay = HTMLRender(
      <AnchoredOverlayTestComponent onOpenCallback={mockOpenCallback} onCloseCallback={mockCloseCallback} />
    )
    const anchor = anchoredOverlay.baseElement.querySelector('[aria-haspopup="true"]')!
    fireEvent.keyDown(anchor, {key: ' '})

    expect(mockOpenCallback).toHaveBeenCalledTimes(1)
    expect(mockOpenCallback).toHaveBeenCalledWith('anchor-key-press')
    expect(mockCloseCallback).toHaveBeenCalledTimes(0)
  })

  it('should call onClose when the user clicks off of the overlay', () => {
    const mockOpenCallback = jest.fn()
    const mockCloseCallback = jest.fn()
    const anchoredOverlay = HTMLRender(
      <AnchoredOverlayTestComponent
        initiallyOpen={true}
        onOpenCallback={mockOpenCallback}
        onCloseCallback={mockCloseCallback}
      />
    )
    fireEvent.mouseDown(anchoredOverlay.baseElement)

    expect(mockOpenCallback).toHaveBeenCalledTimes(0)
    expect(mockCloseCallback).toHaveBeenCalledTimes(1)
    expect(mockCloseCallback).toHaveBeenCalledWith('click-outside')
  })

  it('should call onClose when the escape key is pressed', async () => {
    const mockOpenCallback = jest.fn()
    const mockCloseCallback = jest.fn()
    const anchoredOverlay = HTMLRender(
      <AnchoredOverlayTestComponent
        initiallyOpen={true}
        onOpenCallback={mockOpenCallback}
        onCloseCallback={mockCloseCallback}
      />
    )
    const overlay = await anchoredOverlay.findByRole('none')
    fireEvent.keyDown(overlay, {key: 'Escape'})

    expect(mockOpenCallback).toHaveBeenCalledTimes(0)
    expect(mockCloseCallback).toHaveBeenCalledTimes(1)
    expect(mockCloseCallback).toHaveBeenCalledWith('escape')
  })

  it('should render consistently when open', () => {
    const anchoredOverlay = HTMLRender(<AnchoredOverlayTestComponent initiallyOpen={true} />)
    expect(anchoredOverlay).toMatchSnapshot()
  })
})
