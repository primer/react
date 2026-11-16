import {page, userEvent} from 'vitest/browser'
import {render} from '@testing-library/react'
import {afterEach, beforeEach, describe, it, expect, vi} from 'vitest'
import type React from 'react'
import {useCallback, useRef, useState} from 'react'

import {ActionMenu} from '../deprecated/ActionMenu'
import BaseStyles from '../BaseStyles'
import {Button} from '../Button'
import {ConfirmationDialog} from './ConfirmationDialog'
import {useConfirm} from './useConfirm'
import {Stack} from '../Stack'
import {implementsClassName} from '../utils/testing'
import dialogClasses from '../Dialog/Dialog.module.css'

const originalResizeObserver = globalThis.ResizeObserver

class NoopResizeObserver implements ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const Basic = ({
  confirmButtonType,
  overrideButtonFocus,
}: Pick<React.ComponentProps<typeof ConfirmationDialog>, 'confirmButtonType' | 'overrideButtonFocus'>) => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const onDialogClose = useCallback(() => setIsOpen(false), [])
  return (
    <BaseStyles>
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        Show dialog
      </Button>
      {isOpen && (
        <ConfirmationDialog
          title="Confirm"
          onClose={onDialogClose}
          cancelButtonContent="Secondary"
          confirmButtonContent="Primary"
          confirmButtonType={confirmButtonType}
          overrideButtonFocus={overrideButtonFocus}
        >
          Lorem ipsum dolor sit Pippin good dog.
        </ConfirmationDialog>
      )}
    </BaseStyles>
  )
}

const ShorthandHookFromActionMenu = () => {
  const confirm = useConfirm()
  const [text, setText] = useState('Show menu')
  const onButtonClick = useCallback(async () => {
    if (
      await confirm({
        title: 'Confirm',
        content: 'Confirm',
        cancelButtonContent: 'Secondary',
        confirmButtonContent: 'Primary',
      })
    ) {
      setText('Confirmed')
    }
  }, [confirm])
  return (
    <BaseStyles>
      <Stack gap="none">
        <ActionMenu
          renderAnchor={props => <Button {...props}>{text}</Button>}
          items={[{text: 'Show dialog', onAction: onButtonClick}]}
        />
      </Stack>
    </BaseStyles>
  )
}

const CustomProps = ({
  className,
  width,
  height,
}: Pick<React.ComponentProps<typeof ConfirmationDialog>, 'className' | 'width' | 'height'>) => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const onDialogClose = useCallback(() => setIsOpen(false), [])
  return (
    <BaseStyles>
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        Show dialog
      </Button>
      {isOpen && (
        <ConfirmationDialog title="Confirm" onClose={onDialogClose} className={className} width={width} height={height}>
          Lorem ipsum dolor sit Pippin good dog.
        </ConfirmationDialog>
      )}
    </BaseStyles>
  )
}

const LoadingStates = ({
  confirmButtonLoading,
  cancelButtonLoading,
}: Pick<React.ComponentProps<typeof ConfirmationDialog>, 'confirmButtonLoading' | 'cancelButtonLoading'>) => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const onDialogClose = useCallback(() => setIsOpen(false), [])
  return (
    <BaseStyles>
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        Show dialog
      </Button>
      {isOpen && (
        <ConfirmationDialog
          title="Confirm"
          onClose={onDialogClose}
          cancelButtonContent="Cancel"
          confirmButtonContent="Delete"
          confirmButtonType="danger"
          confirmButtonLoading={confirmButtonLoading}
          cancelButtonLoading={cancelButtonLoading}
        >
          Are you sure you want to delete this?
        </ConfirmationDialog>
      )}
    </BaseStyles>
  )
}

describe('ConfirmationDialog', () => {
  beforeEach(() => {
    globalThis.ResizeObserver = NoopResizeObserver
  })

  afterEach(() => {
    globalThis.ResizeObserver = originalResizeObserver
  })

  it('renders data-component attribute', async () => {
    render(
      <BaseStyles>
        <ConfirmationDialog title="Confirm" onClose={() => {}}>
          Test content
        </ConfirmationDialog>
      </BaseStyles>,
    )

    await expect.element(page.getByRole('alertdialog')).toHaveAttribute('data-component', 'ConfirmationDialog')
  })

  it('focuses the primary action when opened and the confirmButtonType is not set', async () => {
    render(<Basic />)
    await userEvent.click(page.getByText('Show dialog'))
    await expect.element(page.getByRole('button', {name: 'Primary'})).toHaveFocus()
    await expect.element(page.getByRole('button', {name: 'Secondary'})).not.toHaveFocus()
  })

  it('focuses the primary action when opened and the confirmButtonType is not danger', async () => {
    render(<Basic confirmButtonType="primary" />)
    await userEvent.click(page.getByText('Show dialog'))
    await expect.element(page.getByRole('button', {name: 'Primary'})).toHaveFocus()
    await expect.element(page.getByRole('button', {name: 'Secondary'})).not.toHaveFocus()
  })

  it('focuses the secondary action when opened and the confirmButtonType is danger', async () => {
    render(<Basic confirmButtonType="danger" />)
    await userEvent.click(page.getByText('Show dialog'))
    await expect.element(page.getByRole('button', {name: 'Primary'})).not.toHaveFocus()
    await expect.element(page.getByRole('button', {name: 'Secondary'})).toHaveFocus()
  })

  it('supports nested `focusTrap`s', async () => {
    render(<ShorthandHookFromActionMenu />)

    await userEvent.click(page.getByText('Show menu'))
    await userEvent.click(page.getByText('Show dialog'))

    await expect.element(page.getByRole('button', {name: 'Primary'})).toHaveFocus()
    await expect.element(page.getByRole('button', {name: 'Secondary'})).not.toHaveFocus()
  })

  it('accepts a className prop', async () => {
    const testClassName = 'test-class-name'
    render(<CustomProps className={testClassName} />)

    await userEvent.click(page.getByText('Show dialog'))

    const dialog = page.getByRole('alertdialog')
    await expect.element(dialog).toHaveClass(testClassName)
  })

  it('accepts a width prop', async () => {
    render(<CustomProps width="large" />)

    await userEvent.click(page.getByText('Show dialog'))

    const dialog = page.getByRole('alertdialog')
    await expect.element(dialog).toHaveAttribute('data-width', 'large')
  })

  it('accepts a height prop', async () => {
    render(<CustomProps height="small" />)

    await userEvent.click(page.getByText('Show dialog'))

    const dialog = page.getByRole('alertdialog')
    await expect.element(dialog).toHaveAttribute('data-height', 'small')
  })

  it('focuses the confirm button even when dangerous if initialButtonFocus is confirm', async () => {
    render(<Basic confirmButtonType="danger" overrideButtonFocus="confirm" />)

    await userEvent.click(page.getByText('Show dialog'))

    await expect.element(page.getByRole('button', {name: 'Primary'})).toHaveFocus()
    await expect.element(page.getByRole('button', {name: 'Secondary'})).not.toHaveFocus()
  })

  describe('loading states', () => {
    it('applies loading state to confirm button when confirmButtonLoading is true', async () => {
      render(<LoadingStates confirmButtonLoading={true} />)

      await userEvent.click(page.getByText('Show dialog'))

      const confirmButton = page.getByRole('button', {name: 'Delete'})
      const cancelButton = page.getByRole('button', {name: 'Cancel'})

      await expect.element(confirmButton).toHaveAttribute('data-loading', 'true')
      await expect.element(cancelButton).not.toHaveAttribute('data-loading', 'true')
    })

    it('applies loading state to cancel button when cancelButtonLoading is true', async () => {
      render(<LoadingStates cancelButtonLoading={true} />)

      await userEvent.click(page.getByText('Show dialog'))

      const confirmButton = page.getByRole('button', {name: 'Delete'})
      const cancelButton = page.getByRole('button', {name: 'Cancel'})

      await expect.element(cancelButton).toHaveAttribute('data-loading', 'true')
      await expect.element(confirmButton).not.toHaveAttribute('data-loading', 'true')
    })

    it('applies loading state to both buttons when both loading props are true', async () => {
      render(<LoadingStates confirmButtonLoading={true} cancelButtonLoading={true} />)

      await userEvent.click(page.getByText('Show dialog'))

      const confirmButton = page.getByRole('button', {name: 'Delete'})
      const cancelButton = page.getByRole('button', {name: 'Cancel'})

      await expect.element(confirmButton).toHaveAttribute('data-loading', 'true')
      await expect.element(cancelButton).toHaveAttribute('data-loading', 'true')
    })

    it('disables button clicks when button is loading', async () => {
      const mockOnClose = vi.fn()
      render(
        <BaseStyles>
          <ConfirmationDialog
            title="Confirm"
            onClose={mockOnClose}
            confirmButtonLoading={true}
            confirmButtonContent="Delete"
            cancelButtonContent="Cancel"
          >
            Test content
          </ConfirmationDialog>
        </BaseStyles>,
      )

      const confirmButton = page.getByRole('button', {name: 'Delete'})

      await userEvent.click(confirmButton, {force: true})

      // onClose should not be called when button is loading
      expect(mockOnClose).not.toHaveBeenCalled()
    })

    it('shows loading spinner in confirm button when loading', async () => {
      render(<LoadingStates confirmButtonLoading={true} />)

      await userEvent.click(page.getByText('Show dialog'))

      const confirmButton = page.getByRole('button', {name: 'Delete'})

      // Check for loading spinner (Spinner component renders as an SVG)
      const spinner = confirmButton.element().querySelector('svg')
      await expect.element(spinner).toBeInTheDocument()
      expect(confirmButton.element().contains(spinner)).toBe(true)
    })

    it('shows loading spinner in cancel button when loading', async () => {
      render(<LoadingStates cancelButtonLoading={true} />)

      await userEvent.click(page.getByText('Show dialog'))

      const cancelButton = page.getByRole('button', {name: 'Cancel'})

      // Check for loading spinner in cancel button
      const spinner = cancelButton.element().querySelector('svg')
      await expect.element(spinner).toBeInTheDocument()
      expect(cancelButton.element().contains(spinner)).toBe(true)
    })

    it('maintains proper focus management when confirm button is loading', async () => {
      render(<LoadingStates confirmButtonLoading={true} />)

      await userEvent.click(page.getByText('Show dialog'))

      const cancelButton = page.getByRole('button', {name: 'Cancel'})

      // When confirm button is loading and dangerous, focus should be on cancel button
      await expect.element(cancelButton).toHaveFocus()
    })

    it('does not apply loading state when loading props are false', async () => {
      render(<LoadingStates confirmButtonLoading={false} cancelButtonLoading={false} />)

      await userEvent.click(page.getByText('Show dialog'))

      const confirmButton = page.getByRole('button', {name: 'Delete'})
      const cancelButton = page.getByRole('button', {name: 'Cancel'})

      await expect.element(confirmButton).not.toHaveAttribute('data-loading', 'true')
      await expect.element(cancelButton).not.toHaveAttribute('data-loading', 'true')
    })
  })

  implementsClassName(ConfirmationDialog, dialogClasses.Dialog)

  describe('useConfirm', () => {
    it('removes the host element from the document body when the dialog is closed', async () => {
      render(<ShorthandHookFromActionMenu />)

      await userEvent.click(page.getByText('Show menu'))

      // Capture <body> children after the menu opens so we can reliably detect the confirm() host element
      const bodyChildrenBeforeDialog = Array.from(document.body.children)

      await userEvent.click(page.getByText('Show dialog'))

      await expect.element(page.getByRole('alertdialog')).toBeInTheDocument()
      const dialogElement = page.getByRole('alertdialog').element()

      const hostElement = Array.from(document.body.children).find(el => !bodyChildrenBeforeDialog.includes(el))
      if (!hostElement) throw new Error('Expected confirm() to append a host element to <body>')

      await userEvent.click(page.getByRole('button', {name: 'Secondary'}))

      // After closing, neither the dialog nor its host element should linger in the DOM
      await expect.element(page.getByRole('alertdialog')).not.toBeInTheDocument()
      await expect.poll(() => dialogElement.isConnected).toBe(false)
      await expect.poll(() => hostElement.isConnected).toBe(false)
    })
  })
})
