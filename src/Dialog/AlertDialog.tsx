import React, {useCallback} from 'react'
import {Dialog, DialogButtonProps, DialogHeaderProps, DialogProps} from '../Dialog/Dialog'
import styled from 'styled-components'
import {get} from '../constants'
import Box from '../Box'
import {useFocusZone} from '../hooks/useFocusZone'
import {FocusKeys} from '../behaviors/focusZone'
import ReactDOM from 'react-dom'
import {ThemeProvider, useTheme, ThemeProviderProps} from '../ThemeProvider'

/**
 * Props to customize the ConfirmationDialog.
 */
export interface AlertDialogProps {
  /**
   * Required. This callback is invoked when a gesture to close the dialog
   * is performed. The first argument indicates the gesture.
   */
  onClose(gesture: 'confirm' | 'close-button' | 'escape'): void

  /**
   * Required. The title of the ConfirmationDialog. This is usually a brief
   * question.
   */
  title: React.ReactNode

  /**
   * The text to use for the confirm button. Default: "OK".
   */
  confirmButtonContent?: React.ReactNode

  /**
   * The type of button to use for the confirm button. Default: Button.
   */
  confirmButtonType?: 'normal' | 'primary' | 'danger'
}

const StyledAlertHeader = styled.header`
  padding: ${get('space.2')};
  display: flex;
  flex-direction: row;
`

const StyledTitle = styled(Box)`
  font-size: ${get('fontSizes.3')};
  font-weight: ${get('fontWeights.bold')};
  padding: 6px ${get('space.2')};
  flex-grow: 1;
`

const StyledAlertBody = styled(Box)`
  font-size: ${get('fontSizes.1')};
  padding: 0 ${get('space.3')} ${get('space.3')} ${get('space.3')};
  color: ${get('colors.text.tertiary')};
  flex-grow: 1;
`

const StyledAlertFooter = styled(Box)`
  display: flex;
  margin: 0 ${get('space.3')} ${get('space.3')} ${get('space.3')};

  button {
    font-size: ${get('fontSizes.1')};
    flex: 1 1 0;
    padding: 5px ${get('space.3')};
  }
`

const AlertHeader: React.FC<DialogHeaderProps> = ({title, onClose, dialogLabelId}) => {
  const onCloseClick = useCallback(() => {
    onClose('close-button')
  }, [onClose])
  return (
    <StyledAlertHeader>
      <StyledTitle id={dialogLabelId}>{title}</StyledTitle>
      <Dialog.CloseButton onClose={onCloseClick} />
    </StyledAlertHeader>
  )
}

const AlertBody: React.FC<DialogProps> = ({children}) => <StyledAlertBody>{children}</StyledAlertBody>

const AlertFooter: React.FC<DialogProps> = ({footerButtons}) => {
  const {containerRef: footerRef} = useFocusZone({
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.Tab,
    focusInStrategy: 'closest'
  })

  return (
    <StyledAlertFooter ref={footerRef as React.RefObject<HTMLDivElement>}>
      <Dialog.Buttons buttons={footerButtons ?? []} />
    </StyledAlertFooter>
  )
}

/**
 * An AlertDialog is a special kind of dialog with more rigid behavior. It
 * is used to alert or confirm a single user action. AlertDialogs can only have at most
 * one button: no buttons or one to confirm the alert dialog.
 * No custom rendering capabilities are provided for AlertDialog.
 */
export const AlertDialog: React.FC<AlertDialogProps> = props => {
  const {onClose, title, confirmButtonContent, confirmButtonType = 'normal', children} = props

  const onConfirmButtonClick = useCallback(() => {
    onClose('confirm')
  }, [onClose])

  const confirmButton: DialogButtonProps = {
    content: confirmButtonContent,
    buttonType: confirmButtonType,
    variant: 'large',
    onClick: onConfirmButtonClick
  }

  const hasConfirm = !!confirmButtonContent
  const footerButtons = hasConfirm ? [confirmButton] : undefined
  return (
    <Dialog
      onClose={onClose}
      title={title}
      footerButtons={footerButtons}
      role="alertdialog"
      width="medium"
      renderHeader={AlertHeader}
      renderBody={AlertBody}
      renderFooter={hasConfirm ? AlertFooter : undefined}
    >
      {children}
    </Dialog>
  )
}

type AlertOptions = Omit<AlertDialogProps, 'onClose'> & {content: React.ReactNode}
async function alert(themeProps: ThemeProviderProps, options: AlertOptions): Promise<boolean> {
  const {content, ...alertDialogProps} = options

  return new Promise(resolve => {
    const hostElement = document.createElement('div')
    const onClose: AlertDialogProps['onClose'] = gesture => {
      ReactDOM.unmountComponentAtNode(hostElement)
      resolve(gesture === 'confirm')
    }

    ReactDOM.render(
      <ThemeProvider {...themeProps}>
        <AlertDialog {...alertDialogProps} onClose={onClose}>
          {content}
        </AlertDialog>
      </ThemeProvider>,
      hostElement
    )
  })
}

/**
 * This hook takes no parameters and returns an `async` function, `alert`. When `alert`
 * is called, it shows the confirmation dialog. When the dialog is dismissed, a promise is
 * resolved with `true` or `false` depending on whether or not the confirm button was used.
 */
export function useAlert() {
  const {theme, colorMode, dayScheme, nightScheme} = useTheme()

  return useCallback(
    (options: AlertOptions) => {
      const themeProps: ThemeProviderProps = {theme, colorMode, dayScheme, nightScheme}
      return alert(themeProps, options)
    },
    [theme, colorMode, dayScheme, nightScheme]
  )
}
