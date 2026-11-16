import {describe, expect, it} from 'vitest'
import {useState, useRef} from 'react'
import Text from '../../Text'
import {Button} from '../../Button'
import {Dialog} from '../DialogV1'
import {render as HTMLRender} from '@testing-library/react'
import {page, userEvent} from 'vitest/browser'
import {implementsClassName} from '../../utils/testing'
import classes from './Dialog.module.css'

/* Dialog Version 1*/

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
          <div style={{padding: 'var(--stack-gap-normal)'}}>
            <Text style={{fontFamily: 'sans-serif'}}>Some content</Text>
          </div>
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
        <div style={{padding: 'var(--stack-gap-normal)'}}>
          <Text style={{fontFamily: 'sans-serif'}}>Some content</Text>
        </div>
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
        <div style={{padding: 'var(--stack-gap-normal)'}}>
          <Text style={{fontFamily: 'sans-serif'}}>Some content</Text>
          <button type="button" data-testid="inner-button" ref={buttonRef}>
            hi
          </button>
        </div>
      </div>
    </Dialog>
  )
}

const DialogWithCustomFocusRefAndReturnFocusRef = () => {
  const [isOpen, setIsOpen] = useState(true)
  const returnFocusRef = useRef(null)
  const buttonRef = useRef(null)
  return (
    <div>
      <Button data-testid="trigger-button" ref={returnFocusRef} onClick={() => setIsOpen(true)}>
        Show Dialog
      </Button>
      <Dialog
        returnFocusRef={returnFocusRef}
        isOpen={isOpen}
        initialFocusRef={buttonRef}
        onDismiss={() => setIsOpen(false)}
        aria-labelledby="header"
      >
        <div data-testid="inner">
          <Dialog.Header id="header">Title</Dialog.Header>
          <div style={{padding: 'var(--stack-gap-normal)'}}>
            <Text style={{fontFamily: 'sans-serif'}}>Some content</Text>
            <button type="button" data-testid="inner-button" ref={buttonRef}>
              hi
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

describe('Dialog', () => {
  implementsClassName(
    props => (
      <Dialog isOpen {...props}>
        <Dialog.Header>Header</Dialog.Header>
      </Dialog>
    ),
    classes.Dialog,
  )
  implementsClassName(
    props => (
      <Dialog isOpen>
        <Dialog.Header {...props}>Header</Dialog.Header>
      </Dialog>
    ),
    classes.Header,
  )

  it('Toggles when you click close button', async () => {
    HTMLRender(<Component />)

    await expect.element(page.getByTestId('inner')).toBeInTheDocument()
    await page.getByRole('button', {name: 'Close', exact: true}).click()

    await expect.element(page.getByTestId('inner')).not.toBeInTheDocument()
  })

  it('Renders dialog when isOpen is true', async () => {
    HTMLRender(<Component />)

    await expect.element(page.getByTestId('inner')).toBeInTheDocument()
  })

  it('Does not render dialog when isOpen is false', async () => {
    HTMLRender(<ClosedDialog />)

    await expect.element(page.getByTestId('inner')).not.toBeInTheDocument()
  })

  it('Focuses close button when Dialog is opened', async () => {
    HTMLRender(<Component />)
    await expect.element(page.getByRole('button', {name: 'Close', exact: true})).toHaveFocus()
  })

  it('Focuses custom ref when Dialog is opened', async () => {
    HTMLRender(<DialogWithCustomFocusRef />)
    await expect.element(page.getByTestId('inner-button')).toHaveFocus()
  })

  it('Returns focus to returnFocusRef', async () => {
    HTMLRender(<Component />)

    await expect.element(page.getByTestId('inner')).toBeInTheDocument()
    await page.getByRole('button', {name: 'Close', exact: true}).click()

    await expect.element(page.getByTestId('inner')).not.toBeInTheDocument()
    await expect.element(page.getByTestId('trigger-button')).toHaveFocus()
  })

  it('Returns focus to returnFocusRef on escape', async () => {
    HTMLRender(<DialogWithCustomFocusRefAndReturnFocusRef />)
    await expect.element(page.getByTestId('inner-button')).toHaveFocus()

    await expect.element(page.getByTestId('inner')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')

    await expect.element(page.getByTestId('inner')).not.toBeInTheDocument()
    await expect.element(page.getByTestId('trigger-button')).toHaveFocus()
  })
})
