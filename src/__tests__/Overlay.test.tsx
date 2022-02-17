import React, {useRef, useState} from 'react'
import {Overlay, Box, Text, ButtonDanger, Button} from '..'
import {render, cleanup, waitFor, fireEvent, act} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {axe, toHaveNoViolations} from 'jest-axe'
import '@testing-library/jest-dom'
import theme from '../theme'
import BaseStyles from '../BaseStyles'
import {ThemeProvider} from '../ThemeProvider'
import {NestedOverlays, MemexNestedOverlays, MemexIssueOverlay} from '../stories/Overlay.stories'

expect.extend(toHaveNoViolations)

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
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('should focus element passed into function', async () => {
    const {getByText} = render(<TestComponent initialFocus="button" />)
    userEvent.click(getByText('open overlay'))
    await waitFor(() => getByText('Confirm'))
    const confirmButton = getByText('Confirm')
    expect(document.activeElement).toEqual(confirmButton)
  })

  it('should focus first element when nothing is passed', async () => {
    const {getByText} = render(<TestComponent />)
    userEvent.click(getByText('open overlay'))
    await waitFor(() => getByText('Cancel'))
    const cancelButton = getByText('Cancel')
    expect(document.activeElement).toEqual(cancelButton)
  })

  it('should call function when user clicks outside container', () => {
    const mockFunction = jest.fn()
    const {getByText, queryAllByText} = render(<TestComponent callback={mockFunction} />)
    act(() => userEvent.click(getByText('open overlay')))
    act(() => userEvent.click(getByText('outside')))
    expect(mockFunction).toHaveBeenCalledTimes(1)
    const cancelButtons = queryAllByText('Cancel')
    expect(cancelButtons).toHaveLength(0)
  })

  it('should call function when user presses escape', () => {
    const mockFunction = jest.fn()
    const {getByText, queryAllByText} = render(<TestComponent callback={mockFunction} />)
    act(() => userEvent.click(getByText('open overlay')))
    const domNode = getByText('Are you sure?')
    fireEvent.keyDown(domNode, {key: 'Escape', code: 'Escape', keyCode: 27, charCode: 27})
    expect(mockFunction).toHaveBeenCalledTimes(1)
    const cancelButtons = queryAllByText('Cancel')
    expect(cancelButtons).toHaveLength(0)
  })

  it('should close the top most overlay on escape', () => {
    const container = render(
      <ThemeProvider>
        <NestedOverlays />
      </ThemeProvider>
    )

    // open first menu
    userEvent.click(container.getByLabelText('Add this repository to a list'))
    expect(container.getByText('Add to list')).toBeInTheDocument()

    // open second menu
    userEvent.click(container.getByText('Create list'))
    expect(container.getByPlaceholderText('Name this list')).toBeInTheDocument()

    // hitting escape on input should close the second menu but not the first
    fireEvent.keyDown(container.getByPlaceholderText('Name this list'), {key: 'Escape', code: 'Escape'})
    expect(container.queryByPlaceholderText('Name this list')).not.toBeInTheDocument()
    // this breaks:
    expect(container.getByText('Add to list')).toBeInTheDocument()

    // hitting escape again in first overlay should close it
    fireEvent.keyDown(container.getByText('Add to list'), {key: 'Escape', code: 'Escape'})
    expect(container.queryByText('Add to list')).not.toBeInTheDocument()
  })

  it('memex repro: should only close the dropdown when escape is pressed', () => {
    const container = render(
      <ThemeProvider>
        <MemexNestedOverlays />
      </ThemeProvider>
    )

    // open first menu
    userEvent.click(container.getByLabelText('Add custom iteration'))
    expect(container.getByLabelText('Change duration unit')).toBeInTheDocument()

    // open dropdown menu
    userEvent.click(container.getByLabelText('Change duration unit'))
    expect(container.getByRole('menu')).toBeInTheDocument()

    // hitting escape on menu item should close the dropdown menu but not the overlay
    fireEvent.keyDown(container.getByRole('menu'), {key: 'Escape', code: 'Escape'})
    expect(container.queryByRole('menu')).not.toBeInTheDocument()
    // this breaks:
    expect(container.getByLabelText('Change duration unit')).toBeInTheDocument()
  })

  it('memex repro: should not close overlay when input has event.preventDefault', () => {
    const container = render(
      <ThemeProvider>
        <MemexIssueOverlay />
      </ThemeProvider>
    )

    // clicking the title opens overlay
    userEvent.click(container.getByText('Implement draft issue editor'))
    expect(container.getByLabelText('Change issue title')).toBeInTheDocument()

    // clicking the button changes to input
    userEvent.click(container.getByLabelText('Change issue title'))
    expect(container.getByDisplayValue('Implement draft issue editor')).toBeInTheDocument()

    // pressing Escape inside input brings back the button but does not close the overlay
    fireEvent.keyDown(container.getByDisplayValue('Implement draft issue editor'), {key: 'Escape', code: 'Escape'})
    expect(container.getByLabelText('Change issue title')).toBeInTheDocument()

    // hitting Escape again should close the Overlay
    fireEvent.keyDown(container.getByLabelText('Change issue title'), {key: 'Escape', code: 'Escape'})
    expect(container.queryByLabelText('Change issue title')).not.toBeInTheDocument()
  })

  // https://github.com/primer/react/issues/1802
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('memex repro: should not leak overlay events to the document', () => {
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

    userEvent.click(container.getByText('open overlay'))
    fireEvent.keyDown(container.getByText('Text inside Overlay'), {key: 'Escape', code: 'Escape'})

    // if stopPropagation worked, mockHandler would not have been called
    expect(mockHandler).toHaveBeenCalledTimes(0)
  })
})
