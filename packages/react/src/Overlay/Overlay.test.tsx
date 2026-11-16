import {render} from '@testing-library/react'
import {page, userEvent} from 'vitest/browser'
import React, {useRef, useState} from 'react'
import {describe, expect, it, vi} from 'vitest'
import {Button} from '../Button'
import Overlay from '../Overlay'
import Text from '../Text'
import BaseStyles from '../BaseStyles'
import {NestedOverlays, MemexNestedOverlays, MemexIssueOverlay, PositionedOverlays} from './Overlay.features.stories'
import {implementsClassName} from '../utils/testing'
import classes from './Overlay.module.css'

type TestComponentSettings = {
  initialFocus?: 'button'
  width?: 'small' | 'medium' | 'large' | 'auto' | 'xlarge' | 'xxlarge'
  callback?: () => void
  preventFocusOnOpen?: boolean
  preventFocusOnClose?: boolean
}
const TestComponent = ({
  initialFocus,
  width = 'small',
  preventFocusOnOpen = undefined,
  preventFocusOnClose,
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
        <Button style={{position: 'absolute', right: 16, bottom: 16}}>outside</Button>
        {isOpen ? (
          <Overlay
            initialFocusRef={initialFocus === 'button' ? confirmButtonRef : undefined}
            returnFocusRef={openButtonRef}
            ignoreClickRefs={[openButtonRef]}
            onEscape={closeOverlay}
            onClickOutside={closeOverlay}
            width={width}
            preventFocusOnOpen={preventFocusOnOpen}
            preventFocusOnClose={preventFocusOnClose}
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
        <Button ref={returnFocusRef}>trigger</Button>
        <Overlay returnFocusRef={returnFocusRef} {...props}>
          <div>test content</div>
        </Overlay>
      </div>
    )
  }, classes.Overlay)

  it('should focus initialFocusRef element passed into function on open', async () => {
    const user = userEvent
    render(<TestComponent initialFocus="button" />)
    await user.click(page.getByRole('button', {name: 'open overlay'}))
    const confirmButton = page.getByRole('button', {name: 'Confirm'}).element()
    expect(document.activeElement).toEqual(confirmButton)
  })

  it('should focus first element on open when no initialFocusRef is passed', async () => {
    const user = userEvent
    render(<TestComponent />)
    await user.click(page.getByRole('button', {name: 'open overlay'}))
    const cancelButton = page.getByRole('button', {name: 'Cancel'}).element()
    expect(document.activeElement).toEqual(cancelButton)
  })

  it('should not focus any element within the overlay on open when preventFocusOnOpen prop is true', async () => {
    const user = userEvent
    render(<TestComponent initialFocus="button" preventFocusOnOpen={true} />)
    await user.click(page.getByRole('button', {name: 'open overlay'}))

    const overlayContainer = page.getByRole('dialog').element()
    const focusedElement = document.activeElement! as HTMLElement
    expect(focusedElement).toBeInTheDocument()
    expect(overlayContainer).not.toContainElement(focusedElement)
  })

  it('should focus returnFocusRef element on close', async () => {
    const user = userEvent
    render(<TestComponent />)

    // Open overlay
    const openButton = page.getByRole('button', {name: 'open overlay'}).element()
    await user.click(openButton)

    // Close overlay
    const cancelButton = page.getByRole('button', {name: 'Cancel'})
    await user.click(cancelButton)

    // Focus should return to button that was originally clicked to open overlay
    expect(document.activeElement).toEqual(openButton)
  })

  it('should focus returnFocusRef element on close when preventFocusOnOpen prop is true', async () => {
    const user = userEvent
    render(<TestComponent initialFocus="button" preventFocusOnOpen={true} />)

    // Open overlay
    const openButton = page.getByRole('button', {name: 'open overlay'}).element()
    await user.click(openButton)

    // Close overlay
    const cancelButton = page.getByRole('button', {name: 'Cancel'})
    await user.click(cancelButton)

    // Focus should return to button that was originally clicked to open overlay
    expect(document.activeElement).toEqual(openButton)
  })

  it.each([undefined, false, true])(
    'controls focus restoration with preventFocusOnClose set to %s',
    async preventFocusOnClose => {
      const user = userEvent
      render(<TestComponent preventFocusOnClose={preventFocusOnClose} />)
      const trigger = page.getByRole('button', {name: 'open overlay'}).element()
      await user.click(trigger)

      expect(page.getByRole('button', {name: 'Cancel'}).element()).toHaveFocus()
      expect(page.getByRole('dialog').element()).not.toHaveAttribute('preventFocusOnClose')

      await user.click(page.getByRole('button', {name: 'Cancel'}))
      expect(page.getByRole('dialog').elements()).toHaveLength(0)

      if (preventFocusOnClose) {
        expect(trigger).not.toHaveFocus()
      } else {
        expect(trigger).toHaveFocus()
      }
    },
  )

  it('preserves consumer-managed focus when automatic restoration is prevented', async () => {
    const user = userEvent
    render(
      <TestComponent
        preventFocusOnClose
        callback={() => {
          page.getByRole('button', {name: 'outside'}).element().focus()
        }}
      />,
    )

    await user.click(page.getByRole('button', {name: 'open overlay'}))
    await user.click(page.getByRole('button', {name: 'Cancel'}))

    expect(page.getByRole('dialog').elements()).toHaveLength(0)
    expect(page.getByRole('button', {name: 'outside'}).element()).toHaveFocus()
  })

  it('should call function when user clicks outside container', async () => {
    const user = userEvent
    const mockFunction = vi.fn()
    render(<TestComponent callback={mockFunction} />)
    await user.click(page.getByText('open overlay'))
    await user.click(page.getByText('outside'))
    expect(mockFunction).toHaveBeenCalledTimes(1)
    const cancelButtons = page.getByText('Cancel').elements()
    expect(cancelButtons).toHaveLength(0)
  })

  it('should call function when user presses escape', async () => {
    const user = userEvent
    const mockFunction = vi.fn()
    render(<TestComponent callback={mockFunction} />)
    await user.click(page.getByText('open overlay'))
    await user.keyboard('{Escape}')
    expect(mockFunction).toHaveBeenCalledTimes(1)
    const cancelButtons = page.getByText('Cancel').elements()
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

    const user = userEvent
    render(<NestedOverlays />)

    // open first menu
    await user.click(page.getByLabelText('Add this repository to a list'))
    expect(page.getByText('Add to list').element()).toBeInTheDocument()

    // open second menu
    await user.click(page.getByText('Create list'))
    const nameInput = page.getByPlaceholder('Name this list')
    expect(nameInput.element()).toBeInTheDocument()

    // hitting escape on input should close the second menu but not the first
    nameInput.element().focus()
    await user.keyboard('{Escape}')
    expect(page.getByPlaceholder('Name this list').elements()).toHaveLength(0)
    expect(page.getByText('Add to list').element()).toBeInTheDocument()

    // Focus is returned to button which opens tooltip, close that first:
    await user.keyboard('{Escape}')

    // hitting escape again in first overlay should close it
    await user.keyboard('{Escape}')
    expect(page.getByText('Add to list').elements()).toHaveLength(0)

    spy.mockRestore()
  })

  it.todo('should right align when given `right: 0` and `position: fixed`', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(message => {
      if (!message.startsWith('global handler')) {
        throw new Error(
          `Expected console.log() to be called with: 'global handler:' but instead it was called with: ${message}`,
        )
      }
    })

    const user = userEvent
    render(<PositionedOverlays role="dialog" right />)

    // open first menu
    await user.click(page.getByText('Open right overlay'))
    expect(page.getByText('Look! right aligned').element()).toBeInTheDocument()

    const innerOverlay = page.getByText('Look! right aligned').element()
    const overlay = page.getByRole('dialog').element()

    expect(innerOverlay).toBeInTheDocument()
    expect(overlay).toHaveStyle({position: 'fixed', right: '0'})
    expect(overlay).not.toHaveStyle({left: '0'})

    spy.mockRestore()
  })

  it.todo('should left align when not given position and left props', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(message => {
      if (!message.startsWith('global handler')) {
        throw new Error(
          `Expected console.log() to be called with: 'global handler:' but instead it was called with: ${message}`,
        )
      }
    })

    const user = userEvent
    render(<PositionedOverlays role="dialog" />)

    // open first menu
    await user.click(page.getByText('Open left overlay'))
    expect(page.getByText('Look! left aligned').element()).toBeInTheDocument()

    const innerOverlay = page.getByText('Look! left aligned').element()
    const overlay = page.getByRole('dialog').element()

    expect(innerOverlay).toBeInTheDocument()
    expect(overlay).toHaveStyle({left: '0', position: 'absolute'})

    spy.mockRestore()
  })

  it('memex repro: should only close the dropdown when escape is pressed', async () => {
    const user = userEvent
    render(<MemexNestedOverlays />)

    // open first menu
    await user.click(page.getByLabelText('Add custom iteration'))
    expect(page.getByLabelText('Change duration unit').element()).toBeInTheDocument()

    // open dropdown menu
    await user.click(page.getByLabelText('Change duration unit'))
    expect(page.getByRole('menu').element()).toBeInTheDocument()

    // hitting escape on menu item should close the dropdown menu but not the overlay
    await user.keyboard('{Escape}')
    expect(page.getByRole('menu').elements()).toHaveLength(0)
    // this breaks:
    expect(page.getByLabelText('Change duration unit').element()).toBeInTheDocument()
  })

  it('memex repro: should not close overlay when input has event.preventDefault', async () => {
    const user = userEvent
    render(<MemexIssueOverlay />)

    // clicking the title opens overlay
    await user.click(page.getByText('Implement draft issue editor'))
    expect(page.getByLabelText('Change issue title').element()).toBeInTheDocument()

    // clicking the button changes to input
    await user.click(page.getByLabelText('Change issue title'))
    const titleInput = page.getByRole('textbox')
    expect(titleInput.element()).toBeInTheDocument()
    expect(titleInput.element()).toHaveValue('Implement draft issue editor')

    // pressing Escape inside input brings back the button but does not close the overlay
    titleInput.element().focus()
    await user.keyboard('{Escape}')
    expect(page.getByLabelText('Change issue title').element()).toBeInTheDocument()

    // hitting Escape again should close the Overlay
    await user.keyboard('{Escape}')
    expect(page.getByLabelText('Change issue title').elements()).toHaveLength(0)
  })

  it.todo('memex repro: should not leak overlay events to the document', async () => {
    const user = userEvent
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

    render(<BugRepro1802 />)

    await user.click(page.getByText('open overlay'))
    await user.keyboard('{Escape}')

    // if stopPropagation worked, mockHandler would not have been called
    expect(mockHandler).toHaveBeenCalledTimes(0)
  })

  it('should not have `data-reflow-container` if FF is not enabled', async () => {
    const user = userEvent
    render(<TestComponent />)

    await user.click(page.getByRole('button', {name: 'open overlay'}))

    const container = page.getByRole('dialog').element()
    expect(container).not.toHaveAttribute('data-reflow-container')
  })
})
