import React from 'react'
import {CloseIconButton, type CloseIconButtonProps} from './CloseIconButton'
import {cn} from './cn'

export type NarrowFullscreenCloseButtonProps = CloseIconButtonProps

/** Dismisses fullscreen content. It only appears while the content covers a narrow viewport. */
export const NarrowFullscreenCloseButton = React.forwardRef<HTMLElement, NarrowFullscreenCloseButtonProps>(
  function NarrowFullscreenCloseButton({className, ...rest}, ref) {
    return (
      <CloseIconButton
        {...rest}
        ref={ref}
        className={cn(
          'primer:absolute primer:top-2 primer:right-2 primer:z-default primer:hidden primer:max-md:inline-flex',
          className,
        )}
      />
    )
  },
)
