'use client'

import {Dialog as BaseDialog} from '@base-ui/react/dialog'
import {DialogModalContext} from './dialogModalContext'

export function DialogModalRoot<Payload>({modal = true, ...props}: BaseDialog.Root.Props<Payload>) {
  return (
    <DialogModalContext.Provider value={modal}>
      <BaseDialog.Root {...props} modal={modal} />
    </DialogModalContext.Provider>
  )
}
