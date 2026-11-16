import {page, userEvent} from 'vitest/browser'
import {describe, expect, it, vi} from 'vitest'
import {render} from '@testing-library/react'
import {ErrorDialog} from '../ErrorDialog'

describe('Table.ErrorDialog', () => {
  it('should use a default title of "Error" if `title` is not provided', async () => {
    render(<ErrorDialog />)
    await expect
      .element(
        page.getByRole('alertdialog', {
          name: 'Error',
        }),
      )
      .toBeInTheDocument()
  })

  it('should allow customizing the title of the dialog through `title`', async () => {
    const customTitle = 'custom-title'
    render(<ErrorDialog title={customTitle} />)
    await expect
      .element(
        page.getByRole('alertdialog', {
          name: customTitle,
        }),
      )
      .toBeInTheDocument()
  })

  it('should use "Retry" as the confirm text of the dialog', async () => {
    render(<ErrorDialog />)
    await expect.element(page.getByRole('button', {name: 'Retry'})).toBeInTheDocument()
  })

  it('should call `onRetry` if the confirm button is interacted with', async () => {
    const onRetry = vi.fn()

    render(<ErrorDialog onRetry={onRetry} />)
    await userEvent.click(page.getByText('Retry'))
    expect(onRetry).toHaveBeenCalledTimes(1)

    onRetry.mockClear()

    await userEvent.keyboard('{Enter}')
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('should set "Dismiss" as the cancel text of the dialog', async () => {
    render(<ErrorDialog />)
    await expect.element(page.getByRole('button', {name: 'Dismiss'})).toBeInTheDocument()
  })

  it('should call `onDismiss` if the cancel button is interacted with', async () => {
    const onDismiss = vi.fn()

    render(<ErrorDialog onDismiss={onDismiss} />)
    await userEvent.click(page.getByText('Dismiss'))
    expect(onDismiss).toHaveBeenCalledTimes(1)

    onDismiss.mockClear()

    await userEvent.keyboard('{Enter}')
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('should render `children` as the content of the dialog', async () => {
    render(
      <ErrorDialog>
        <span data-testid="children">children</span>
      </ErrorDialog>,
    )

    await expect
      .element(page.getByRole('alertdialog', {name: 'Error'}))
      .toContainElement(page.getByTestId('children').element())
  })
})
