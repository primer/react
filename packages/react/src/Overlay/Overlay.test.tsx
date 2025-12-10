import {render, waitFor, fireEvent} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, {useRef, useState} from 'react'
import {describe, expect, it, vi} from 'vitest'
import {Button} from '../Button'
import Overlay from '../Overlay'
import Text from '../Text'
import BaseStyles from '../BaseStyles'
import {NestedOverlays, MemexNestedOverlays, MemexIssueOverlay, PositionedOverlays} from './Overlay.features.stories'
import {FeatureFlags} from '../FeatureFlags'
import {implementsClassName} from '../utils/testing'
import classes from './Overlay.module.css'

type TestComponentSettings = {
  initialFocus?: 'button'
  width?: 'small' | 'medium' | 'large' | 'auto' | 'xlarge' | 'xxlarge'
  callback?: () => void
  preventFocusOnOpen?: boolean
}
const TestComponent = ({
  initialFocus,
  width = 'small',
  preventFocusOnOpen = undefined,
  callback,
}: TestComponentSettings) => {
  const [isOpen, setIsOpen] = useState(false)
  const openButtonRef = useRef<HTMLButtonElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const closeOverlay = () => {
    setIsOpen(false)
    if (callback) {
      callback()
    }
  }
  return (
    <BaseStyles>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
        ref={anchorRef}
      >
        <Button ref={openButtonRef} onClick={() => setIsOpen(!isOpen)}>
          open overlay
        </Button>
        <Button>outside</Button>
        {isOpen ? (
          <Overlay
            initialFocusRef={initialFocus === 'button' ? confirmButtonRef : undefined}
            returnFocusRef={openButtonRef}
            ignoreClickRefs={[openButtonRef]}
            onEscape={closeOverlay}
            onClickOutside={closeOverlay}
            width={width}
            preventFocusOnOpen={preventFocusOnOpen}
            role="dialog"
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '8px',
              }}
            >
              <Text>Are you sure?</Text>
              <Button variant="danger" onClick={closeOverlay}>
                Cancel
              </Button>
              <Button onClick={closeOverlay} ref={confirmButtonRef}>
                Confirm
              </Button>
            </div>
          </Overlay>
        ) : null}
      </div>
    </BaseStyles>
  )
}

describe('Overlay', () => {
  implementsClassName(props => {
    const returnFocusRef = useRef<HTMLButtonElement>(null)
    return (
      <div>
        <button ref={returnFocusRef}>trigger</button>
        <Overlay returnFocusRef={returnFocusRef} {...props}>
          <div>test content</div>
        </Overlay>
      </div>
    )
  }, classes.Overlay)

  it('should focus initialFocusRef element passed into function on open', async () => {
    const user = userEvent.setup()
    const {getByRole} = render(<TestComponent initialFocus="button" />)
    await user.click(getByRole('button', {name: 'open overlay'}))
    await waitFor(() => getByRole('button', {name: 'Confirm'}))
    const confirmButton = getByRole('button', {name: 'Confirm'})
    expect(document.activeElement).toEqual(confirmButton)
  })

  it('should focus first element on open when no initialFocusRef is passed', async () => {
    const user = userEvent.setup()
    const {getByRole} = render(<TestComponent />)
    await user.click(getByRole('button', {name: 'open overlay'}))
    await waitFor(() => getByRole('button', {name: 'Cancel'}))
    const cancelButton = getByRole('button', {name: 'Cancel'})
    expect(document.activeElement).toEqual(cancelButton)
  })

  it('should not focus any element within the overlay on open when preventFocusOnOpen prop is true', async () => {
    const user = userEvent.setup()
    const {getByRole} = render(<TestComponent initialFocus="button" preventFocusOnOpen={true} />)
    await user.click(getByRole('button', {name: 'open overlay'}))

    const overlayContainer = getByRole('dialog')
    const focusedElement = document.activeElement! as HTMLElement
    expect(focusedElement).toBeInTheDocument()
    expect(overlayContainer).not.toContainElement(focusedElement)
  })

  it('should focus returnFocusRef element on close', async () => {
    const user = userEvent.setup()
    const {getByRole} = render(<TestComponent />)

    // Open overlay
    await waitFor(() => getByRole('button', {name: 'open overlay'}))
    const openButton = getByRole('button', {name: 'open overlay'})
    await user.click(openButton)

    // Close overlay
    await waitFor(() => getByRole('button', {name: 'Cancel'}))
    const cancelButton = getByRole('button', {name: 'Cancel'})
    await user.click(cancelButton)

    // Focus should return to button that was originally clicked to open overlay
    expect(document.activeElement).toEqual(openButton)
  })

  it('should focus returnFocusRef element on close when preventFocusOnOpen prop is true', async () => {
    const user = userEvent.setup()
    const {getByRole} = render(<TestComponent initialFocus="button" preventFocusOnOpen={true} />)

    // Open overlay
    await waitFor(() => getByRole('button', {name: 'open overlay'}))
    const openButton = getByRole('button', {name: 'open overlay'})
    await user.click(openButton)

    // Close overlay
    await waitFor(() => getByRole('button', {name: 'Cancel'}))
    const cancelButton = getByRole('button', {name: 'Cancel'})
    await user.click(cancelButton)

    // Focus should return to button that was originally clicked to open overlay
    expect(document.activeElement).toEqual(openButton)
  })

  it('should call function when user clicks outside container', async () => {
    const user = userEvent.setup()
    const mockFunction = vi.fn()
    const {getByText, queryAllByText} = render(<TestComponent callback={mockFunction} />)
    await user.click(getByText('open overlay'))
    await user.click(getByText('outside'))
    expect(mockFunction).toHaveBeenCalledTimes(1)
    const cancelButtons = queryAllByText('Cancel')
    expect(cancelButtons).toHaveLength(0)
  })

  it('should call function when user presses escape', async () => {
    const user = userEvent.setup()
    const mockFunction = vi.fn()
    const {getByText, queryAllByText} = render(<TestComponent callback={mockFunction} />)
    await user.click(getByText('open overlay'))
    const domNode = getByText('Are you sure?')
    fireEvent.keyDown(domNode, {key: 'Escape', code: 'Escape', keyCode: 27, charCode: 27})
    expect(mockFunction).toHaveBeenCalledTimes(1)
    const cancelButtons = queryAllByText('Cancel')
    expect(cancelButtons).toHaveLength(0)
  })

  it('should close the top most overlay on escape', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(message => {
      if (!message.startsWith('global handler')) {
        throw new Error(
          `Expected console.log() to be called with: 'global handler:' but instead it was called with: ${message}`,
        )
      }
    })

    const user = userEvent.setup()
    const container = render(<NestedOverlays />)

    // open first menu
    await user.click(container.getByLabelText('Add this repository to a list'))
    expect(container.getByText('Add to list')).toBeInTheDocument()

    // open second menu
    fireEvent.click(container.getByText('Create list'))
    expect(container.getByPlaceholderText('Name this list')).toBeInTheDocument()

    // hitting escape on input should close the second menu but not the first
    fireEvent.keyDown(container.getByPlaceholderText('Name this list'), {key: 'Escape', code: 'Escape'})
    expect(container.queryByPlaceholderText('Name this list')).not.toBeInTheDocument()
    // this breaks:
    expect(container.getByText('Add to list')).toBeInTheDocument()

    // hitting escape again in first overlay should close it
    fireEvent.keyDown(container.getByText('Add to list'), {key: 'Escape', code: 'Escape'})
    expect(container.queryByText('Add to list')).not.toBeInTheDocument()

    spy.mockRestore()
  })

  it.skip('should right align when given `right: 0` and `position: fixed`', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(message => {
      if (!message.startsWith('global handler')) {
        throw new Error(
          `Expected console.log() to be called with: 'global handler:' but instead it was called with: ${message}`,
        )
      }
    })

    const user = userEvent.setup()
    const container = render(<PositionedOverlays role="dialog" right />)

    // open first menu
    await user.click(container.getByText('Open right overlay'))
    expect(container.getByText('Look! right aligned')).toBeInTheDocument()

    const innerOverlay = container.getByText('Look! right aligned')
    const overlay = container.getByRole('dialog')

    expect(innerOverlay).toBeInTheDocument()
    expect(overlay).toHaveStyle({position: 'fixed', right: '0'})
    expect(overlay).not.toHaveStyle({left: '0'})

    spy.mockRestore()
  })

  it.skip('should left align when not given position and left props', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(message => {
      if (!message.startsWith('global handler')) {
        throw new Error(
          `Expected console.log() to be called with: 'global handler:' but instead it was called with: ${message}`,
        )
      }
    })

    const user = userEvent.setup()
    const container = render(<PositionedOverlays role="dialog" />)

    // open first menu
    await user.click(container.getByText('Open left overlay'))
    expect(container.getByText('Look! left aligned')).toBeInTheDocument()

    const innerOverlay = container.getByText('Look! left aligned')
    const overlay = container.getByRole('dialog')

    expect(innerOverlay).toBeInTheDocument()
    expect(overlay).toHaveStyle({left: '0', position: 'absolute'})

    spy.mockRestore()
  })

  it('memex repro: should only close the dropdown when escape is pressed', async () => {
    const user = userEvent.setup()
    const container = render(<MemexNestedOverlays />)

    // open first menu
    await user.click(container.getByLabelText('Add custom iteration'))
    expect(container.getByLabelText('Change duration unit')).toBeInTheDocument()

    // open dropdown menu
    await user.click(container.getByLabelText('Change duration unit'))
    expect(container.getByRole('menu')).toBeInTheDocument()

    // hitting escape on menu item should close the dropdown menu but not the overlay
    fireEvent.keyDown(container.getByRole('menu'), {key: 'Escape', code: 'Escape'})
    expect(container.queryByRole('menu')).not.toBeInTheDocument()
    // this breaks:
    expect(container.getByLabelText('Change duration unit')).toBeInTheDocument()
  })

  it('memex repro: should not close overlay when input has event.preventDefault', async () => {
    const user = userEvent.setup()
    const container = render(<MemexIssueOverlay />)

    // clicking the title opens overlay
    await user.click(container.getByText('Implement draft issue editor'))
    expect(container.getByLabelText('Change issue title')).toBeInTheDocument()

    // clicking the button changes to input
    await user.click(container.getByLabelText('Change issue title'))
    expect(container.getByDisplayValue('Implement draft issue editor')).toBeInTheDocument()

    // pressing Escape inside input brings back the button but does not close the overlay
    fireEvent.keyDown(container.getByDisplayValue('Implement draft issue editor'), {key: 'Escape', code: 'Escape'})
    expect(container.getByLabelText('Change issue title')).toBeInTheDocument()

    // hitting Escape again should close the Overlay
    fireEvent.keyDown(container.getByLabelText('Change issue title'), {key: 'Escape', code: 'Escape'})
    expect(container.queryByLabelText('Change issue title')).not.toBeInTheDocument()
  })

  it.skip('memex repro: should not leak overlay events to the document', async () => {
    const user = userEvent.setup()
    const mockHandler = vi.fn()
    const BugRepro1802 = () => {
      const [isOpen, setIsOpen] = useState(false)
      const closeOverlay = () => setIsOpen(false)
      const buttonRef = useRef<HTMLButtonElement>(null)

      React.useEffect(() => {
        document.addEventListener('keydown', mockHandler)
        return () => document.removeEventListener('keydown', mockHandler)
      }, [])

      return (
        <BaseStyles>
          <Button ref={buttonRef} onClick={() => setIsOpen(true)}>
            open overlay
          </Button>
          {isOpen ? (
            <Overlay returnFocusRef={buttonRef} onEscape={closeOverlay} onClickOutside={closeOverlay}>
              <Text>Text inside Overlay</Text>
            </Overlay>
          ) : null}
        </BaseStyles>
      )
    }

    const container = render(<BugRepro1802 />)

    await user.click(container.getByText('open overlay'))
    fireEvent.keyDown(container.getByText('Text inside Overlay'), {key: 'Escape', code: 'Escape'})

    // if stopPropagation worked, mockHandler would not have been called
    expect(mockHandler).toHaveBeenCalledTimes(0)
  })

  it('should not have `data-reflow-container` if FF is not enabled', async () => {
    const user = userEvent.setup()
    const {getByRole} = render(<TestComponent />)

    await user.click(getByRole('button', {name: 'open overlay'}))

    const container = getByRole('dialog')
    expect(container).not.toHaveAttribute('data-reflow-container')
  })

  it('should `data-reflow-container` if FF is enabled', async () => {
    const user = userEvent.setup()
    const {getByRole} = render(
      <FeatureFlags flags={{primer_react_overlay_overflow: true}}>
        <TestComponent />
      </FeatureFlags>,
    )

    await user.click(getByRole('button', {name: 'open overlay'}))

    const container = getByRole('dialog')
    expect(container).toHaveAttribute('data-reflow-container')
  })
})
