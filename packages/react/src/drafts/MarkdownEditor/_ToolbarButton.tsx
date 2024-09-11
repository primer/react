import React, {forwardRef, useContext} from 'react'
import type {IconButtonProps} from '../../Button'
import {IconButton} from '../../Button'
import {MarkdownEditorContext} from './_MarkdownEditorContext'

export const ToolbarButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
  const {disabled, condensed} = useContext(MarkdownEditorContext)

  return (
    // eslint-disable-next-line primer-react/a11y-remove-disable-tooltip
    <IconButton
      unsafeDisableTooltip={true}
      ref={ref}
      size={condensed ? 'small' : 'medium'}
      variant="invisible"
      disabled={disabled}
      // Prevent focus leaving input:
      onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
      {...props}
      sx={{color: 'fg.muted', ...props.sx}}
      // Keeping the tooltip disable since it is not maintained anymore and its tests were failing.
    />
  )
})
ToolbarButton.displayName = 'MarkdownEditor.ToolbarButton'
