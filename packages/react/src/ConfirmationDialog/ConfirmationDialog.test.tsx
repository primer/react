import {render, fireEvent} from '@testing-library/react'
import {describe, it, expect, vi} from 'vitest'
import type React from 'react'
import {useCallback, useRef, useState} from 'react'

import {ActionMenu} from '../deprecated/ActionMenu'
import BaseStyles from '../BaseStyles'
import {Button} from '../Button'
import {ConfirmationDialog, useConfirm} from './ConfirmationDialog'
import theme from '../theme'
import {ThemeProvider} from '../ThemeProvider'
import {Stack} from '../Stack'

const Basic = ({
  confirmButtonType,
  initialFocusButton,
}: Pick<React.ComponentProps<typeof ConfirmationDialog>, 'confirmButtonType' | 'initialFocusButton'>) => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const onDialogClose = useCallback(() => setIsOpen(false), [])
  return (
    <ThemeProvider theme={theme}>
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
            initialFocusButton={initialFocusButton}
          >
            Lorem ipsum dolor sit Pippin good dog.
          </ConfirmationDialog>
        )}
      </BaseStyles>
    </ThemeProvider>
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
    <ThemeProvider theme={theme}>
      <BaseStyles>
        <Stack gap="none">
          <ActionMenu
            renderAnchor={props => <Button {...props}>{text}</Button>}
            items={[{text: 'Show dialog', onAction: onButtonClick}]}
          />
        </Stack>
      </BaseStyles>
    </ThemeProvider>
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
    <ThemeProvider theme={theme}>
      <BaseStyles>
        <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
          Show dialog
        </Button>
        {isOpen && (
          <ConfirmationDialog
            title="Confirm"
            onClose={onDialogClose}
            className={className}
            width={width}
            height={height}
          >
            Lorem ipsum dolor sit Pippin good dog.
          </ConfirmationDialog>
        )}
      </BaseStyles>
    </ThemeProvider>
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
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  )
}

describe('ConfirmationDialog', () => {
  it('focuses the primary action when opened and the confirmButtonType is not set', async () => {
    const {getByText, getByRole} = render(<Basic />)
    fireEvent.click(getByText('Show dialog'))
    expect(getByRole('button', {name: 'Primary'})).toEqual(document.activeElement)
    expect(getByRole('button', {name: 'Secondary'})).not.toEqual(document.activeElement)
  })

  it('focuses the primary action when opened and the confirmButtonType is not danger', async () => {
    const {getByText, getByRole} = render(<Basic confirmButtonType="primary" />)
    fireEvent.click(getByText('Show dialog'))
    expect(getByRole('button', {name: 'Primary'})).toEqual(document.activeElement)
    expect(getByRole('button', {name: 'Secondary'})).not.toEqual(document.activeElement)
  })

  it('focuses the secondary action when opened and the confirmButtonType is danger', async () => {
    const {getByText, getByRole} = render(<Basic confirmButtonType="danger" />)
    fireEvent.click(getByText('Show dialog'))
    expect(getByRole('button', {name: 'Primary'})).not.toEqual(document.activeElement)
    expect(getByRole('button', {name: 'Secondary'})).toEqual(document.activeElement)
  })

  it('supports nested `focusTrap`s', async () => {
    const {getByText, getByRole} = render(<ShorthandHookFromActionMenu />)

    fireEvent.click(getByText('Show menu'))
    fireEvent.click(getByText('Show dialog'))

    expect(getByRole('button', {name: 'Primary'})).toEqual(document.activeElement)
    expect(getByRole('button', {name: 'Secondary'})).not.toEqual(document.activeElement)
  })

  it('accepts a className prop', async () => {
    const testClassName = 'test-class-name'
    const {getByText, getByRole} = render(<CustomProps className={testClassName} />)

    fireEvent.click(getByText('Show dialog'))

    const dialog = getByRole('alertdialog')
    expect(dialog.classList.contains(testClassName)).toBe(true)
  })

  it('accepts a width prop', async () => {
    const {getByText, getByRole} = render(<CustomProps width="large" />)

    fireEvent.click(getByText('Show dialog'))

    const dialog = getByRole('alertdialog')
    expect(dialog.getAttribute('data-width')).toBe('large')
  })

  it('accepts a height prop', async () => {
    const {getByText, getByRole} = render(<CustomProps height="small" />)

    fireEvent.click(getByText('Show dialog'))

    const dialog = getByRole('alertdialog')
    expect(dialog.getAttribute('data-height')).toBe('small')
  })

  it('focuses the confirm button even when dangerous if initialButtonFocus is confirm', async () => {
    const {getByText, getByRole} = render(<Basic confirmButtonType="danger" initialFocusButton="confirm" />)

    fireEvent.click(getByText('Show dialog'))

    expect(getByRole('button', {name: 'Primary'})).toEqual(document.activeElement)
    expect(getByRole('button', {name: 'Secondary'})).not.toEqual(document.activeElement)
  })

  describe('loading states', () => {
    it('applies loading state to confirm button when confirmButtonLoading is true', async () => {
      const {getByText, getByRole} = render(<LoadingStates confirmButtonLoading={true} />)

      fireEvent.click(getByText('Show dialog'))

      const confirmButton = getByRole('button', {name: 'Delete'})
      const cancelButton = getByRole('button', {name: 'Cancel'})

      expect(confirmButton).toHaveAttribute('data-loading', 'true')
      expect(cancelButton).not.toHaveAttribute('data-loading', 'true')
    })

    it('applies loading state to cancel button when cancelButtonLoading is true', async () => {
      const {getByText, getByRole} = render(<LoadingStates cancelButtonLoading={true} />)

      fireEvent.click(getByText('Show dialog'))

      const confirmButton = getByRole('button', {name: 'Delete'})
      const cancelButton = getByRole('button', {name: 'Cancel'})

      expect(cancelButton).toHaveAttribute('data-loading', 'true')
      expect(confirmButton).not.toHaveAttribute('data-loading', 'true')
    })

    it('applies loading state to both buttons when both loading props are true', async () => {
      const {getByText, getByRole} = render(<LoadingStates confirmButtonLoading={true} cancelButtonLoading={true} />)

      fireEvent.click(getByText('Show dialog'))

      const confirmButton = getByRole('button', {name: 'Delete'})
      const cancelButton = getByRole('button', {name: 'Cancel'})

      expect(confirmButton).toHaveAttribute('data-loading', 'true')
      expect(cancelButton).toHaveAttribute('data-loading', 'true')
    })

    it('disables button clicks when button is loading', async () => {
      const mockOnClose = vi.fn()
      const {getByRole} = render(
        <ThemeProvider theme={theme}>
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
          </BaseStyles>
        </ThemeProvider>,
      )

      const confirmButton = getByRole('button', {name: 'Delete'})

      fireEvent.click(confirmButton)

      // onClose should not be called when button is loading
      expect(mockOnClose).not.toHaveBeenCalled()
    })

    it('shows loading spinner in confirm button when loading', async () => {
      const {getByText, getByRole} = render(<LoadingStates confirmButtonLoading={true} />)

      fireEvent.click(getByText('Show dialog'))

      const confirmButton = getByRole('button', {name: 'Delete'})

      // Check for loading spinner (Spinner component renders as an SVG)
      const spinner = confirmButton.querySelector('svg')
      expect(spinner).toBeInTheDocument()
      expect(confirmButton.contains(spinner)).toBe(true)
    })

    it('shows loading spinner in cancel button when loading', async () => {
      const {getByText, getByRole} = render(<LoadingStates cancelButtonLoading={true} />)

      fireEvent.click(getByText('Show dialog'))

      const cancelButton = getByRole('button', {name: 'Cancel'})

      // Check for loading spinner in cancel button
      const spinner = cancelButton.querySelector('svg')
      expect(spinner).toBeInTheDocument()
      expect(cancelButton.contains(spinner)).toBe(true)
    })

    it('maintains proper focus management when confirm button is loading', async () => {
      const {getByText, getByRole} = render(<LoadingStates confirmButtonLoading={true} />)

      fireEvent.click(getByText('Show dialog'))

      const cancelButton = getByRole('button', {name: 'Cancel'})

      // When confirm button is loading and dangerous, focus should be on cancel button
      expect(cancelButton).toEqual(document.activeElement)
    })

    it('does not apply loading state when loading props are false', async () => {
      const {getByText, getByRole} = render(<LoadingStates confirmButtonLoading={false} cancelButtonLoading={false} />)

      fireEvent.click(getByText('Show dialog'))

      const confirmButton = getByRole('button', {name: 'Delete'})
      const cancelButton = getByRole('button', {name: 'Cancel'})

      expect(confirmButton).not.toHaveAttribute('data-loading', 'true')
      expect(cancelButton).not.toHaveAttribute('data-loading', 'true')
    })
  })
})
