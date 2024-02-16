import React, {useCallback} from 'react'
import {createRoot} from 'react-dom/client'
import styled from 'styled-components'
import Box from '../Box'
import type {ThemeProviderProps} from '../ThemeProvider'
import {ThemeProvider, useTheme} from '../ThemeProvider'
import {FocusKeys} from '@primer/behaviors'
import {get} from '../constants'
import type {DialogProps, DialogHeaderProps, DialogButtonProps} from '../Dialog/Dialog'
import {Dialog} from '../Dialog/Dialog'
import {useFocusZone} from '../hooks/useFocusZone'
import BaseStyles from '../BaseStyles'

/**
 * Props to customize the ConfirmationDialog.
 */
export interface ConfirmationDialogProps {
  /**
   * Required. This callback is invoked when a gesture to close the dialog
   * is performed. The first argument indicates the gesture.
   */
  onClose: (gesture: 'confirm' | 'close-button' | 'cancel' | 'escape') => void

  /**
   * Required. The title of the ConfirmationDialog. This is usually a brief
   * question.
   */
  title: React.ReactNode

  /**
   * The text to use for the cancel button. Default: "Cancel".
   */
  cancelButtonContent?: React.ReactNode

  /**
   * The text to use for the confirm button. Default: "OK".
   */
  confirmButtonContent?: React.ReactNode

  /**
   * The type of button to use for the confirm button. Default: Button.
   */
  confirmButtonType?: 'normal' | 'primary' | 'danger'
}

const StyledConfirmationHeader = styled.div`
  padding: ${get('space.2')};
  display: flex;
  flex-direction: row;
`
const StyledTitle = styled(Box).attrs({as: 'h1'})`
  font-size: ${get('fontSizes.3')};
  font-weight: ${get('fontWeights.bold')};
  padding: 6px ${get('space.2')};
  flex-grow: 1;
  margin: 0; /* override default margin */
`
const ConfirmationHeader: React.FC<React.PropsWithChildren<DialogHeaderProps>> = ({title, onClose, dialogLabelId}) => {
  const onCloseClick = useCallback(() => {
    onClose('close-button')
  }, [onClose])
  return (
    <StyledConfirmationHeader>
      <StyledTitle id={dialogLabelId}>{title}</StyledTitle>
      <Dialog.CloseButton onClose={onCloseClick} />
    </StyledConfirmationHeader>
  )
}
const StyledConfirmationBody = styled(Box)`
  font-size: ${get('fontSizes.1')};
  padding: 0 ${get('space.3')} ${get('space.3')} ${get('space.3')};
  color: ${get('colors.fg.muted')};
  flex-grow: 1;
`
const ConfirmationBody: React.FC<React.PropsWithChildren<DialogProps>> = ({children}) => {
  return <StyledConfirmationBody>{children}</StyledConfirmationBody>
}
const StyledConfirmationFooter = styled(Box)`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  grid-gap: ${get('space.2')};
  align-items: end;
  justify-content: end;
  padding: ${get('space.1')} ${get('space.3')} ${get('space.3')};
`
const ConfirmationFooter: React.FC<React.PropsWithChildren<DialogProps>> = ({footerButtons}) => {
  const {containerRef: footerRef} = useFocusZone({
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.Tab,
    focusInStrategy: 'closest',
  })
  // Must have exactly 2 buttons!
  return (
    <StyledConfirmationFooter ref={footerRef as React.RefObject<HTMLDivElement>}>
      <Dialog.Buttons buttons={footerButtons ?? []} />
    </StyledConfirmationFooter>
  )
}

/**
 * A ConfirmationDialog is a special kind of dialog with more rigid behavior. It
 * is used to confirm a user action. ConfirmationDialogs always have exactly
 * two buttons: one to cancel the action and one to confirm it. No custom
 * rendering capabilities are provided for ConfirmationDialog.
 */
export const ConfirmationDialog: React.FC<React.PropsWithChildren<ConfirmationDialogProps>> = props => {
  const {
    onClose,
    title,
    cancelButtonContent = 'Cancel',
    confirmButtonContent = 'OK',
    confirmButtonType = 'normal',
    children,
  } = props

  const onCancelButtonClick = useCallback(() => {
    onClose('cancel')
  }, [onClose])
  const onConfirmButtonClick = useCallback(() => {
    onClose('confirm')
  }, [onClose])
  const isConfirmationDangerous = confirmButtonType === 'danger'
  const cancelButton: DialogButtonProps = {
    content: cancelButtonContent,
    onClick: onCancelButtonClick,
    autoFocus: isConfirmationDangerous,
  }
  const confirmButton: DialogButtonProps = {
    content: confirmButtonContent,
    buttonType: confirmButtonType,
    onClick: onConfirmButtonClick,
    autoFocus: !isConfirmationDangerous,
  }
  const footerButtons = [cancelButton, confirmButton]
  return (
    <Dialog
      onClose={onClose}
      title={title}
      footerButtons={footerButtons}
      role="alertdialog"
      width="medium"
      renderHeader={ConfirmationHeader}
      renderBody={ConfirmationBody}
      renderFooter={ConfirmationFooter}
    >
      {children}
    </Dialog>
  )
}

let hostElement: Element | null = null
export type ConfirmOptions = Omit<ConfirmationDialogProps, 'onClose'> & {content: React.ReactNode}
async function confirm(themeProps: ThemeProviderProps, options: ConfirmOptions): Promise<boolean> {
  const {content, ...confirmationDialogProps} = options
  return new Promise(resolve => {
    hostElement ||= document.createElement('div')
    if (!hostElement.isConnected) document.body.append(hostElement)
    const root = createRoot(hostElement)
    const onClose: ConfirmationDialogProps['onClose'] = gesture => {
      root.unmount()
      if (gesture === 'confirm') {
        resolve(true)
      } else {
        resolve(false)
      }
    }
    root.render(
      <ThemeProvider {...themeProps}>
        <BaseStyles>
          <ConfirmationDialog {...confirmationDialogProps} onClose={onClose}>
            {content}
          </ConfirmationDialog>
        </BaseStyles>
      </ThemeProvider>,
    )
  })
}

/**
 * This hook takes no parameters and returns an `async` function, `confirm`. When `confirm`
 * is called, it shows the confirmation dialog. When the dialog is dismissed, a promise is
 * resolved with `true` or `false` depending on whether or not the confirm button was used.
 */
export function useConfirm() {
  const {theme, colorMode, dayScheme, nightScheme} = useTheme()
  const result = useCallback(
    (options: ConfirmOptions) => {
      const themeProps: ThemeProviderProps = {theme, colorMode, dayScheme, nightScheme}
      return confirm(themeProps, options)
    },
    [theme, colorMode, dayScheme, nightScheme],
  )
  return result
}
