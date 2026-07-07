import React, {useCallback} from 'react'
import {createRoot} from 'react-dom/client'
import BaseStyles from '../BaseStyles'
import {ConfirmationDialog, type ConfirmationDialogProps} from './ConfirmationDialog'

export type ConfirmOptions = Omit<ConfirmationDialogProps, 'onClose'> & {content: React.ReactNode}

async function confirm(options: ConfirmOptions): Promise<boolean> {
  const {content, ...confirmationDialogProps} = options
  return new Promise(resolve => {
    const hostElement = document.createElement('div')
    document.body.append(hostElement)
    const root = createRoot(hostElement)
    const onClose: ConfirmationDialogProps['onClose'] = gesture => {
      root.unmount()
      hostElement.remove()
      resolve(gesture === 'confirm')
    }
    root.render(
      React.createElement(
        BaseStyles,
        null,
        React.createElement(ConfirmationDialog, {...confirmationDialogProps, onClose}, content),
      ),
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
