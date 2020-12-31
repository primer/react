import React, {useState, useRef} from 'react'
import {Dialog, Box, Text, Button} from '..'
import {COMMON, FLEX, LAYOUT} from '../constants'
import {render as HTMLRender, cleanup, act, screen, waitFor, fireEvent} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
import {behavesAsComponent, mount, checkExports} from '../utils/testing'
expect.extend(toHaveNoViolations)

const comp = (
  <Dialog isOpen onDismiss={() => null} aria-labelledby="header">
    <Dialog.Header id="header">Title</Dialog.Header>
    <Box p={3}>
      <Text fontFamily="sans-serif">Some content</Text>
    </Box>
  </Dialog>
)

const Component = () => {
  const [isOpen, setIsOpen] = useState(true)
  const returnFocusRef = useRef(null)
  return (
    <div>
      <Button data-testid="trigger-button" ref={returnFocusRef} onClick={() => setIsOpen(true)}>
        Show Dialog
      </Button>
      <Dialog
        returnFocusRef={returnFocusRef}
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        aria-labelledby="header"
      >
        <div data-testid="inner">
          <Dialog.Header id="header">Title</Dialog.Header>
          <Box p={3}>
            <Text fontFamily="sans-serif">Some content</Text>
          </Box>
        </div>
      </Dialog>
    </div>
  )
}

const ClosedDialog = () => {
  return (
    <Dialog isOpen={false} onDismiss={() => null} aria-labelledby="header">
      <div data-testid="inner">
        <Dialog.Header id="header">Title</Dialog.Header>
        <Box p={3}>
          <Text fontFamily="sans-serif">Some content</Text>
        </Box>
      </div>
    </Dialog>
  )
}

const DialogWithCustomFocusRef = () => {
  const buttonRef = useRef(null)
  return (
    <Dialog isOpen initialFocusRef={buttonRef} onDismiss={() => null} aria-labelledby="header">
      <div data-testid="inner">
        <Dialog.Header id="header">Title</Dialog.Header>
        <Box p={3}>
          <Text fontFamily="sans-serif">Some content</Text>
          <button data-testid="inner-button" ref={buttonRef}>
            hi
          </button>
        </Box>
      </div>
    </Dialog>
  )
}

describe('Dialog', () => {
  // because Dialog returns a React fragment the as and sx tests fail always, so they are skipped
  behavesAsComponent(Dialog, [COMMON, LAYOUT], () => comp, {skipAs: true, skipSx: true})

  checkExports('Dialog', {
    default: Dialog,
  })

  describe('Dialog.Header', () => {
    behavesAsComponent(Dialog.Header, [COMMON, FLEX, LAYOUT])
  })

  it('should have no axe violations', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    const {container} = HTMLRender(comp)
    // eslint-disable-next-line no-console
    console.warn.mockRestore()
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('Toggles when you click close button', async () => {
    const {getByLabelText, getByTestId, queryByTestId} = HTMLRender(<Component />)

    expect(getByTestId('inner')).toBeTruthy()
    act(() => {
      fireEvent.click(getByLabelText('Close'))
    })

    expect(queryByTestId('inner')).toBeNull()

    cleanup()
  })

  it('Renders dialog when isOpen is true', async () => {
    const {getByTestId} = HTMLRender(<Component />)

    expect(getByTestId('inner')).toBeTruthy()

    cleanup()
  })

  it('Does not render dialog when isOpen is false', async () => {
    const {queryByTestId} = HTMLRender(<ClosedDialog />)

    expect(queryByTestId('inner')).toBeNull()

    cleanup()
  })

  it('Focuses close button when Dialog is opened', async () => {
    const {getByLabelText} = HTMLRender(<Component />)
    const closeButton = getByLabelText('Close')
    expect(document.activeElement).toEqual(closeButton)
    cleanup()
  })

  it('Focuses custom ref when Dialog is opened', async () => {
    const {getByTestId} = HTMLRender(<DialogWithCustomFocusRef />)
    const innerButton = getByTestId('inner-button')
    expect(document.activeElement).toEqual(innerButton)
    cleanup()
  })

  it('Returns focus to returnFocusRef', async () => {
    const {getByLabelText, getByTestId, queryByTestId} = HTMLRender(<Component />)

    expect(getByTestId('inner')).toBeTruthy()
    act(() => {
      fireEvent.click(getByLabelText('Close'))
    })

    expect(queryByTestId('inner')).toBeNull()
    const triggerButton = getByTestId('trigger-button')
    expect(document.activeElement).toEqual(triggerButton)

    cleanup()
  })
})
