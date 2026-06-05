import type React from 'react'
import {useCallback} from 'react'
import {createRoot} from 'react-dom/client'
import BaseStyles from '../BaseStyles'
import {ConfirmationDialog, type ConfirmationDialogProps} from './ConfirmationDialog'

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

let hostElement: Element | null = null

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
