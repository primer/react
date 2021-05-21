import React, {useCallback} from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import Box from '../Box'
import {ThemeProvider, useTheme, ThemeProviderProps} from '../ThemeProvider'
import {FocusKeys} from '../behaviors/focusZone'
import {get} from '../constants'
import {Dialog, DialogProps, DialogHeaderProps, DialogButtonProps} from '../Dialog/Dialog'
import {useFocusZone} from '../hooks/useFocusZone'

/**
 * Props to customize the ConfirmationDialog.
 */
export interface ConfirmationDialogProps {
  /**
   * Required. This callback is invoked when a gesture to close the dialog
   * is performed. The first argument indicates the gesture.
   */
  onClose: (gesture: 'confirm' | 'cancel' | 'close-button' | 'cancel' | 'escape') => void

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

const StyledConfirmationHeader = styled.header`
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
const ConfirmationHeader: React.FC<DialogHeaderProps> = ({title, onClose, dialogLabelId}) => {
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
  color: ${get('colors.text.tertiary')};
  flex-grow: 1;
`
const ConfirmationBody: React.FC<DialogProps> = ({children}) => {
  return <StyledConfirmationBody>{children}</StyledConfirmationBody>
}
const StyledConfirmationFooter = styled(Box)`
  display: flex;
  flex-shrink: 0;
  button {
    font-size: ${get('fontSizes.1')};
    flex: 1 1 0;
    border-bottom: 0;
    margin: 0;
    border-right: 0;
    border-radius: 12px;
    &:first-child {
      border-left: 0;
    }
    &:focus {
      // this is a bit of a hack to get the focus outlines to show up
      z-index: 1;
    }
  }
  button:first-of-type:not(:last-of-type) {
    // All except border-bottom-left-radius, which should follow the curvature of the container
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  button:last-of-type:not(:first-of-type) {
    // All except border-bottom-right-radius, which should follow the curvature of the container
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 0;
  }
  button:first-of-type:last-of-type {
    // When the footer contains a single button, it should follow the curvature of the container
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  button:not(:first-of-type):not(:last-of-type) {
    border-radius: 0;
  }
`
const ConfirmationFooter: React.FC<DialogProps> = ({footerButtons}) => {
  const {containerRef: footerRef} = useFocusZone({
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.Tab,
    focusInStrategy: 'closest'
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
export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = props => {
  const {
    onClose,
    title,
    cancelButtonContent = 'Cancel',
    confirmButtonContent = 'OK',
    confirmButtonType = 'normal',
    children
  } = props

  const onCancelButtonClick = useCallback(() => {
    onClose('cancel')
  }, [onClose])
  const onConfirmButtonClick = useCallback(() => {
    onClose('confirm')
  }, [onClose])
  const cancelButton: DialogButtonProps = {
    content: cancelButtonContent,
    onClick: onCancelButtonClick,
    autoFocus: true,
    variant: 'large'
  }
  const confirmButton: DialogButtonProps = {
    content: confirmButtonContent,
    buttonType: confirmButtonType,
    variant: 'large',
    onClick: onConfirmButtonClick
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

export type ConfirmOptions = Omit<ConfirmationDialogProps, 'onClose'> & {content: React.ReactNode}
async function confirm(themeProps: ThemeProviderProps, options: ConfirmOptions): Promise<boolean> {
  const {content, ...confirmationDialogProps} = options
  return new Promise(resolve => {
    const hostElement = document.createElement('div')
    const onClose: ConfirmationDialogProps['onClose'] = gesture => {
      ReactDOM.unmountComponentAtNode(hostElement)
      if (gesture === 'confirm') {
        resolve(true)
      } else {
        resolve(false)
      }
    }
    ReactDOM.render(
      <ThemeProvider {...themeProps}>
        <ConfirmationDialog {...confirmationDialogProps} onClose={onClose}>
          {content}
        </ConfirmationDialog>
      </ThemeProvider>,
      hostElement
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
    [theme, colorMode, dayScheme, nightScheme]
  )
  return result
}
