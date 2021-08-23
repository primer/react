import React from 'react'
import {fireEvent, screen} from '@testing-library/dom'
import {AlertDialog, AlertDialogProps} from '../Dialog/AlertDialog'
import {render, RenderResult} from '@testing-library/react'

describe('AlertDialog', () => {
  const handleClose = jest.fn()
  const title = 'Drop table xyz'
  const content = 'By pressing "OK" you confirm to drop the table'

  const renderElement = (props: Omit<AlertDialogProps, 'onClose' | 'title'> = {}): RenderResult =>
    render(
      <AlertDialog title={title} onClose={handleClose} {...props}>
        {content}
      </AlertDialog>
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

  it('renders without buttons', () => {
    renderElement({buttonContent: null})
    expect(screen.queryByText('Got it!')).toBeNull()
  })

  it('renders with custom button', () => {
    const confirm = 'Got it!'

    renderElement()

    expect(screen.queryByText(confirm)).toBeDefined()
  })
})
