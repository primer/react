import React, {useRef, useState} from 'react'
import {Overlay, Box, Text} from '..'
import {ButtonDanger, Button} from '../deprecated'
import {render, waitFor, fireEvent} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import theme from '../theme'
import BaseStyles from '../BaseStyles'
import {ThemeProvider} from '../ThemeProvider'
import {NestedOverlays, MemexNestedOverlays, MemexIssueOverlay, PositionedOverlays} from './Overlay.features.stories'

type TestComponentSettings = {
  initialFocus?: 'button'
  callback?: () => void
}
const TestComponent = ({initialFocus, callback}: TestComponentSettings) => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const closeOverlay = () => {
    setIsOpen(false)
    if (callback) {
      callback()
    }
  }
  return (
    <ThemeProvider theme={theme}>
      <BaseStyles>
        <Box position="absolute" top={0} left={0} bottom={0} right={0} ref={anchorRef}>
          <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
            open overlay
          </Button>
          <Button>outside</Button>
          {isOpen ? (
            <Overlay
              initialFocusRef={initialFocus === 'button' ? confirmButtonRef : undefined}
              returnFocusRef={buttonRef}
              ignoreClickRefs={[buttonRef]}
              onEscape={closeOverlay}
              onClickOutside={closeOverlay}
              width="small"
            >
              <Box display="flex" flexDirection="column" p={2}>
                <Text>Are you sure?</Text>
                <ButtonDanger onClick={closeOverlay}>Cancel</ButtonDanger>
                <Button onClick={closeOverlay} ref={confirmButtonRef}>
                  Confirm
                </Button>
              </Box>
            </Overlay>
          ) : null}
        </Box>
      </BaseStyles>
    </ThemeProvider>
  )
}

describe('Overlay', () => {
  it('should have no axe violations', async () => {
    const {container} = render(<TestComponent />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('should focus element passed into function', async () => {
    const user = userEvent.setup()
    const {getByText} = render(<TestComponent initialFocus="button" />)
    await user.click(getByText('open overlay'))
    await waitFor(() => getByText('Confirm'))
    const confirmButton = getByText('Confirm')
    expect(document.activeElement).toEqual(confirmButton)
  })

  it('should focus first element when nothing is passed', async () => {
    const user = userEvent.setup()
    const {getByText} = render(<TestComponent />)
    await user.click(getByText('open overlay'))
    await waitFor(() => getByText('Cancel'))
    const cancelButton = getByText('Cancel')
    expect(document.activeElement).toEqual(cancelButton)
  })

  it('should call function when user clicks outside container', async () => {
    const user = userEvent.setup()
    const mockFunction = jest.fn()
    const {getByText, queryAllByText} = render(<TestComponent callback={mockFunction} />)
    await user.click(getByText('open overlay'))
    await user.click(getByText('outside'))
    expect(mockFunction).toHaveBeenCalledTimes(1)
    const cancelButtons = queryAllByText('Cancel')
    expect(cancelButtons).toHaveLength(0)
  })

  it('should call function when user presses escape', async () => {
    const user = userEvent.setup()
    const mockFunction = jest.fn()
    const {getByText, queryAllByText} = render(<TestComponent callback={mockFunction} />)
    await user.click(getByText('open overlay'))
    const domNode = getByText('Are you sure?')
    fireEvent.keyDown(domNode, {key: 'Escape', code: 'Escape', keyCode: 27, charCode: 27})
    expect(mockFunction).toHaveBeenCalledTimes(1)
    const cancelButtons = queryAllByText('Cancel')
    expect(cancelButtons).toHaveLength(0)
  })

  it('should close the top most overlay on escape', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(message => {
      if (!message.startsWith('global handler')) {
        throw new Error(
          `Expected console.log() to be called with: 'global handler:' but instead it was called with: ${message}`,
        )
      }
    })

    const user = userEvent.setup()
    const container = render(
      <ThemeProvider>
        <NestedOverlays />
      </ThemeProvider>,
    )

    // open first menu
    await user.click(container.getByLabelText('Add this repository to a list'))
    expect(container.getByText('Add to list')).toBeInTheDocument()

    // open second menu
    await user.click(container.getByText('Create list'))
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

  it('should right align when given `right: 0` and `position: fixed`', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(message => {
      if (!message.startsWith('global handler')) {
        throw new Error(
          `Expected console.log() to be called with: 'global handler:' but instead it was called with: ${message}`,
        )
      }
    })

    const user = userEvent.setup()
    const container = render(
      <ThemeProvider>
        <PositionedOverlays right />
      </ThemeProvider>,
    )

    // open first menu
    await user.click(container.getByText('Open right overlay'))
    expect(container.getByText('Look! right aligned')).toBeInTheDocument()

    const overlay = container.getByText('Look! right aligned').parentElement?.parentElement

    expect(overlay).toHaveStyle({position: 'fixed', right: 0})
    expect(overlay).not.toHaveStyle({left: 0})

    spy.mockRestore()
  })

  it('should left align when not given position and left props', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(message => {
      if (!message.startsWith('global handler')) {
        throw new Error(
          `Expected console.log() to be called with: 'global handler:' but instead it was called with: ${message}`,
        )
      }
    })

    const user = userEvent.setup()
    const container = render(
      <ThemeProvider>
        <PositionedOverlays />
      </ThemeProvider>,
    )

    // open first menu
    await user.click(container.getByText('Open left overlay'))
    expect(container.getByText('Look! left aligned')).toBeInTheDocument()

    const overlay = container.getByText('Look! left aligned').parentElement?.parentElement
    expect(overlay).toHaveStyle({left: 0, position: 'absolute'})

    spy.mockRestore()
  })

  it('memex repro: should only close the dropdown when escape is pressed', async () => {
    const user = userEvent.setup()
    const container = render(
      <ThemeProvider>
        <MemexNestedOverlays />
      </ThemeProvider>,
    )

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
    const container = render(
      <ThemeProvider>
        <MemexIssueOverlay />
      </ThemeProvider>,
    )

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

  // https://github.com/primer/react/issues/1802
  it.skip('memex repro: should not leak overlay events to the document', async () => {
    const user = userEvent.setup()
    const mockHandler = jest.fn()
    const BugRepro1802 = () => {
      const [isOpen, setIsOpen] = useState(false)
      const closeOverlay = () => setIsOpen(false)
      const buttonRef = useRef<HTMLButtonElement>(null)

      React.useEffect(() => {
        document.addEventListener('keydown', mockHandler)
        return () => document.removeEventListener('keydown', mockHandler)
      }, [])

      return (
        <ThemeProvider theme={theme}>
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
        </ThemeProvider>
      )
    }

    const container = render(<BugRepro1802 />)

    await user.click(container.getByText('open overlay'))
    fireEvent.keyDown(container.getByText('Text inside Overlay'), {key: 'Escape', code: 'Escape'})

    // if stopPropagation worked, mockHandler would not have been called
    expect(mockHandler).toHaveBeenCalledTimes(0)
  })
})
