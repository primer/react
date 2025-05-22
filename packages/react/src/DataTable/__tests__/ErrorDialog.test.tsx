import {describe, expect, it, vi} from 'vitest'
import userEvent from '@testing-library/user-event'
import {render, screen} from '@testing-library/react'
import {ErrorDialog} from '../ErrorDialog'

describe('Table.ErrorDialog', () => {
  it('should use a default title of "Error" if `title` is not provided', () => {
    render(<ErrorDialog />)
    expect(
      screen.getByRole('alertdialog', {
        name: 'Error',
      }),
    ).toBeInTheDocument()
  })

  it('should allow customizing the title of the dialog through `title`', () => {
    const customTitle = 'custom-title'
    render(<ErrorDialog title={customTitle} />)
    expect(
      screen.getByRole('alertdialog', {
        name: customTitle,
      }),
    ).toBeInTheDocument()
  })

  it('should use "Retry" as the confirm text of the dialog', () => {
    render(<ErrorDialog />)
    expect(screen.getByRole('button', {name: 'Retry'})).toBeInTheDocument()
  })

  it('should call `onRetry` if the confirm button is interacted with', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()

    render(<ErrorDialog onRetry={onRetry} />)
    await user.click(screen.getByText('Retry'))
    expect(onRetry).toHaveBeenCalledTimes(1)

    onRetry.mockClear()

    await user.keyboard('{Enter}')
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('should set "Dismiss" as the cancel text of the dialog', () => {
    render(<ErrorDialog />)
    expect(screen.getByRole('button', {name: 'Dismiss'})).toBeInTheDocument()
  })

  it('should call `onDismiss` if the cancel button is interacted with', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()

    render(<ErrorDialog onDismiss={onDismiss} />)
    await user.click(screen.getByText('Dismiss'))
    expect(onDismiss).toHaveBeenCalledTimes(1)

    onDismiss.mockClear()

    await user.keyboard('{Enter}')
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('should render `children` as the content of the dialog', () => {
    render(
      <ErrorDialog>
        <span data-testid="children">children</span>
      </ErrorDialog>,
    )

    expect(screen.getByRole('alertdialog', {name: 'Error'})).toContainElement(screen.getByTestId('children'))
  })
})
