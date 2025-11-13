import type React from 'react'
import {useCallback} from 'react'
import {createRoot} from 'react-dom/client'
import {FocusKeys} from '@primer/behaviors'
import type {DialogProps, DialogHeaderProps, DialogButtonProps, DialogWidth, DialogHeight} from '../Dialog/Dialog'
import {Dialog} from '../Dialog/Dialog'
import {useFocusZone} from '../hooks/useFocusZone'
import BaseStyles from '../BaseStyles'
import classes from './ConfirmationDialog.module.css'
import Heading from '../Heading'

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

  /**
   * Whether the cancel button is in a loading state. Default: false.
   */
  cancelButtonLoading?: boolean

  /**
   * Whether the confirm button is in a loading state. Default: false.
   */
  confirmButtonLoading?: boolean

  /**
   * Overrides the button that should be initially focused when the dialog is opened. By default, the confirm button
   * is focused initially unless it is a dangerous action, in which case the cancel button is focused. This should
   * rarely be overridden, in order to ensure that the user does not accidentally confirm a dangerous action.
   */
  overrideButtonFocus?: 'cancel' | 'confirm'

  /**
   * Additional class names to apply to the dialog
   */
  className?: string

  /**
   * The width of the dialog.
   * small: 296px
   * medium: 320px
   * large: 480px
   * xlarge: 640px
   * @default 'medium'
   */
  width?: DialogWidth

  /**
   * The height of the dialog.
   * small: 480px
   * large: 640px
   * auto: variable based on contents
   */
  height?: DialogHeight
}

const ConfirmationHeader: React.FC<React.PropsWithChildren<DialogHeaderProps>> = ({title, onClose, dialogLabelId}) => {
  const onCloseClick = useCallback(() => {
    onClose('close-button')
  }, [onClose])

  return (
    <div className={classes.ConfirmationHeader}>
      <Heading id={dialogLabelId} as="h1" variant="small">
        {title}
      </Heading>
      <Dialog.CloseButton onClose={onCloseClick} />
    </div>
  )
}

const ConfirmationBody: React.FC<React.PropsWithChildren<DialogProps>> = ({children}) => {
  return <div className={classes.ConfirmationBody}>{children}</div>
}

const ConfirmationFooter: React.FC<React.PropsWithChildren<DialogProps>> = ({footerButtons}) => {
  const {containerRef: footerRef} = useFocusZone({
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.Tab,
    focusInStrategy: 'closest',
  })

  // Must have exactly 2 buttons!
  return (
    (<div ref={footerRef as React.RefObject<HTMLDivElement | null>} className={classes.ConfirmationFooter}>
      <Dialog.Buttons buttons={footerButtons ?? []} />
    </div>)
  );
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
    cancelButtonLoading = false,
    confirmButtonLoading = false,
    children,
    className,
    width = 'medium',
    height,
    overrideButtonFocus,
  } = props

  const onCancelButtonClick = useCallback(() => {
    onClose('cancel')
  }, [onClose])
  const onConfirmButtonClick = useCallback(() => {
    onClose('confirm')
  }, [onClose])
  const isConfirmationDangerous = confirmButtonType === 'danger'
  const buttonToFocus =
    overrideButtonFocus !== undefined ? overrideButtonFocus : isConfirmationDangerous ? 'cancel' : 'confirm'
  const cancelButton: DialogButtonProps = {
    content: cancelButtonContent,
    onClick: onCancelButtonClick,
    autoFocus: buttonToFocus === 'cancel',
    loading: cancelButtonLoading,
  }
  const confirmButton: DialogButtonProps = {
    content: confirmButtonContent,
    buttonType: confirmButtonType,
    onClick: onConfirmButtonClick,
    autoFocus: buttonToFocus === 'confirm',
    loading: confirmButtonLoading,
  }
  const footerButtons = [cancelButton, confirmButton]
  return (
    <Dialog
      onClose={onClose}
      title={title}
      footerButtons={footerButtons}
      role="alertdialog"
      width={width}
      height={height}
      className={className}
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
async function confirm(options: ConfirmOptions): Promise<boolean> {
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
      <BaseStyles>
        <ConfirmationDialog {...confirmationDialogProps} onClose={onClose}>
          {content}
        </ConfirmationDialog>
      </BaseStyles>,
    )
  })
}

/**
 * This hook takes no parameters and returns an `async` function, `confirm`. When `confirm`
 * is called, it shows the confirmation dialog. When the dialog is dismissed, a promise is
 * resolved with `true` or `false` depending on whether or not the confirm button was used.
 */
export function useConfirm() {
  const result = useCallback((options: ConfirmOptions) => {
    return confirm(options)
  }, [])
  return result
}
