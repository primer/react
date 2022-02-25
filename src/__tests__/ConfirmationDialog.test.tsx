import 'babel-polyfill'
import {render as HTMLRender, cleanup, act, fireEvent} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import React, {useCallback, useRef, useState} from 'react'

import {ActionMenu} from '../ActionMenu'
import BaseStyles from '../BaseStyles'
import Box from '../Box'
import Button from '../Button/Button'
import {ConfirmationDialog, useConfirm} from '../Dialog/ConfirmationDialog'
import theme from '../theme'
import {ThemeProvider} from '../ThemeProvider'
import {SSRProvider} from '../utils/ssr'
import {behavesAsComponent, checkExports} from '../utils/testing'

expect.extend(toHaveNoViolations)

const Basic = () => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const onDialogClose = useCallback(() => setIsOpen(false), [])
  return (
    <ThemeProvider theme={theme}>
      <SSRProvider>
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
            >
              Lorem ipsum dolor sit Pippin good dog.
            </ConfirmationDialog>
          )}
        </BaseStyles>
      </SSRProvider>
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
        confirmButtonContent: 'Primary'
      })
    ) {
      setText('Confirmed')
    }
  }, [confirm])
  return (
    <ThemeProvider theme={theme}>
      <SSRProvider>
        <BaseStyles>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <ActionMenu
              renderAnchor={props => <Button {...props}>{text}</Button>}
              items={[{text: 'Show dialog', onAction: onButtonClick}]}
            />
          </Box>
        </BaseStyles>
      </SSRProvider>
    </ThemeProvider>
  )
}

describe('ConfirmationDialog', () => {
  behavesAsComponent({
    Component: ConfirmationDialog,
    toRender: () => <Basic />,
    options: {skipAs: true, skipSx: true}
  })

  checkExports('Dialog/ConfirmationDialog', {
    default: undefined,
    useConfirm,
    ConfirmationDialog
  })

  it('should have no axe violations', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation()
    const {container} = HTMLRender(<Basic />)
    spy.mockRestore()
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('focuses the primary action when opened', async () => {
    const {getByText} = HTMLRender(<Basic />)
    act(() => {
      fireEvent.click(getByText('Show dialog'))
    })
    expect(getByText('Primary')).toEqual(document.activeElement)
    expect(getByText('Secondary')).not.toEqual(document.activeElement)
    cleanup()
  })

  it('supports nested `focusTrap`s', async () => {
    const {getByText} = HTMLRender(<ShorthandHookFromActionMenu />)
    act(() => {
      fireEvent.click(getByText('Show menu'))
    })
    act(() => {
      fireEvent.click(getByText('Show dialog'))
    })
    expect(getByText('Primary')).toEqual(document.activeElement)
    expect(getByText('Secondary')).not.toEqual(document.activeElement)
    cleanup()
  })
})
