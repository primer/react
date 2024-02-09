import React, {forwardRef, useContext} from 'react'
import {IconButton, IconButtonProps} from '../../Button'
import {MarkdownEditorContext} from './_MarkdownEditorContext'

export const ToolbarButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
  const {disabled, condensed} = useContext(MarkdownEditorContext)

  return (
    <IconButton
      ref={ref}
      size={condensed ? 'small' : 'medium'}
      variant="invisible"
      disabled={disabled}
      // Prevent focus leaving input:
      onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
      {...props}
      sx={{color: 'fg.muted', ...props.sx}}
    />
  )
})
ToolbarButton.displayName = 'MarkdownEditor.ToolbarButton'
