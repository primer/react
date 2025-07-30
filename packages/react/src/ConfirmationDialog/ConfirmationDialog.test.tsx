import {render, fireEvent} from '@testing-library/react'
import {describe, it, expect} from 'vitest'
import type React from 'react'
import {useCallback, useRef, useState} from 'react'

import {ActionMenu} from '../deprecated/ActionMenu'
import BaseStyles from '../BaseStyles'
import Box from '../Box'
import {Button} from '../Button'
import {ConfirmationDialog, useConfirm} from './ConfirmationDialog'
import theme from '../theme'
import {ThemeProvider} from '../ThemeProvider'

const Basic = ({confirmButtonType}: Pick<React.ComponentProps<typeof ConfirmationDialog>, 'confirmButtonType'>) => {
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
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <ActionMenu
            renderAnchor={props => <Button {...props}>{text}</Button>}
            items={[{text: 'Show dialog', onAction: onButtonClick}]}
          />
        </Box>
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
})
