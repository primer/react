import React, {useState, useRef} from 'react'
import {Dialog, Box, Text} from '..'
import {Button} from '../deprecated'
import {render as HTMLRender, fireEvent} from '@testing-library/react'
import axe from 'axe-core'
import {behavesAsComponent, checkExports} from '../utils/testing'

/* Dialog Version 2 */

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
  behavesAsComponent({
    Component: Dialog,
    toRender: () => comp,
    options: {skipAs: true, skipSx: true},
  })

  checkExports('Dialog', {
    default: Dialog,
  })

  describe('Dialog.Header', () => {
    behavesAsComponent({Component: Dialog.Header})
  })

  it('should have no axe violations', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation()
    const {container} = HTMLRender(comp)
    spy.mockRestore()
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('Toggles when you click close button', async () => {
    const {getByLabelText, getByTestId, queryByTestId} = HTMLRender(<Component />)

    expect(getByTestId('inner')).toBeTruthy()
    fireEvent.click(getByLabelText('Close'))

    expect(queryByTestId('inner')).toBeNull()
  })

  it('Renders dialog when isOpen is true', async () => {
    const {getByTestId} = HTMLRender(<Component />)

    expect(getByTestId('inner')).toBeTruthy()
  })

  it('Does not render dialog when isOpen is false', async () => {
    const {queryByTestId} = HTMLRender(<ClosedDialog />)

    expect(queryByTestId('inner')).toBeNull()
  })

  it('Focuses close button when Dialog is opened', async () => {
    const {getByLabelText} = HTMLRender(<Component />)
    const closeButton = getByLabelText('Close')
    expect(document.activeElement).toEqual(closeButton)
  })

  it('Focuses custom ref when Dialog is opened', async () => {
    const {getByTestId} = HTMLRender(<DialogWithCustomFocusRef />)
    const innerButton = getByTestId('inner-button')
    expect(document.activeElement).toEqual(innerButton)
  })

  it('Returns focus to returnFocusRef', async () => {
    const {getByLabelText, getByTestId, queryByTestId} = HTMLRender(<Component />)

    expect(getByTestId('inner')).toBeTruthy()
    fireEvent.click(getByLabelText('Close'))

    expect(queryByTestId('inner')).toBeNull()
    const triggerButton = getByTestId('trigger-button')
    expect(document.activeElement).toEqual(triggerButton)
  })

  it('Returns focus to returnFocusRef on escape', async () => {
    const {getByTestId, queryByTestId} = HTMLRender(<Component />)

    expect(getByTestId('inner')).toBeTruthy()
    fireEvent.keyDown(document.body, {key: 'Escape'})

    expect(queryByTestId('inner')).toBeNull()
    const triggerButton = getByTestId('trigger-button')
    expect(document.activeElement).toEqual(triggerButton)
  })
})
