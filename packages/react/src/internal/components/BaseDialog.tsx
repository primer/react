import React from 'react'
import {LiveRegionProvider, LiveRegion} from '../LiveRegion'

interface BaseDialogProps extends React.ComponentPropsWithoutRef<'dialog'> {}

export const BaseDialog = React.forwardRef<React.ElementRef<'dialog'>, BaseDialogProps>(function BaseDialog(
  {children, ...rest},
  ref,
) {
  return (
    <dialog ref={ref} {...rest}>
      <LiveRegionProvider>
        {children}
        <LiveRegion />
      </LiveRegionProvider>
    </dialog>
  )
})
