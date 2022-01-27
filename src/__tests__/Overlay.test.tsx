import React, {useRef, useState} from 'react'
import {Overlay, Box, Text, ButtonDanger, Button} from '..'
import {render, cleanup, waitFor, fireEvent, act} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {axe, toHaveNoViolations} from 'jest-axe'
import theme from '../theme'
import BaseStyles from '../BaseStyles'
import {ThemeProvider} from '../ThemeProvider'

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

// https://github.com/primer/react/issues/1802
const BugRepro1802 = ({mockHandler}: {mockHandler: (event: KeyboardEvent) => void}) => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    document.addEventListener('keydown', mockHandler)
    return () => document.removeEventListener('keydown', mockHandler)
  }, [mockHandler])

  return (
    <ThemeProvider theme={theme}>
      <BaseStyles>
        <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
          open overlay
        </Button>
        {isOpen ? (
          <Overlay returnFocusRef={buttonRef} onEscape={() => setIsOpen(false)} onClickOutside={() => setIsOpen(false)}>
            <Text>Text inside Overlay</Text>
          </Overlay>
        ) : null}
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

  it('should call stop propagation', () => {
    const mockHandler = jest.fn()
    const {getByText} = render(<BugRepro1802 mockHandler={mockHandler} />)
    act(() => userEvent.click(getByText('open overlay')))
    const domNode = getByText('Text inside Overlay')
    fireEvent.keyDown(domNode, {key: 'Escape', code: 'Escape', keyCode: 27, charCode: 27})
    // if stopPropagation worked, mockHandler would not have been called
    expect(mockHandler).toHaveBeenCalledTimes(0)
  })
})
