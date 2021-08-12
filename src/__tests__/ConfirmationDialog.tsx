import React from 'react'
import {fireEvent, screen} from '@testing-library/dom'
import {ConfirmationDialog, ConfirmationDialogProps} from '../Dialog/ConfirmationDialog'
import {render, RenderResult} from '@testing-library/react'

describe('ConfirmationDialog', () => {
  const handleClose = jest.fn()
  const title = 'Are you sure?'
  const content = 'Do you really want to do a trick?'

  const renderElement = (props: Omit<ConfirmationDialogProps, 'onClose' | 'title'> = {}): RenderResult =>
    render(
      <ConfirmationDialog title={title} onClose={handleClose} {...props}>
        {content}
      </ConfirmationDialog>
    )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders a title and content', () => {
    renderElement()

    expect(screen.getByText(title)).toBeTruthy()
    expect(screen.getByText(content)).toBeTruthy()
  })

  it('renders a close button in dialog header', () => {
    renderElement()

    const closeButton = screen.getByLabelText('Close')

    expect(closeButton).toBeDefined()

    fireEvent.click(closeButton)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('renders with default buttons', () => {
    const expectedButtons = ['Cancel', 'OK']

    renderElement()

    for (const btnText of expectedButtons) {
      expect(screen.getByText(btnText)).toBeTruthy()
    }

    fireEvent.click(screen.getByText(expectedButtons[0]))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('renders with custom buttons', () => {
    const cancel = 'Dismiss'
    const confirm = 'Got it!'

    renderElement({
      cancelButtonContent: cancel,
      confirmButtonContent: confirm
    })

    for (const expected of [cancel, confirm]) {
      expect(screen.queryByText(expected)).toBeDefined()
    }
  })

  it.each([
    {prop: 'cancelButtonContent', visible: 'OK', notVisible: 'Cancel'},
    {prop: 'confirmButtonContent', visible: 'Cancel', notVisible: 'OK'}
  ])('renders "$visible" but not "$notVisible" when $prop is set to falsy value', ({prop, visible, notVisible}) => {
    renderElement({
      [prop]: null
    })

    expect(screen.getByText(visible)).toBeTruthy()
    expect(screen.queryByText(notVisible)).toBeFalsy()
  })
})
