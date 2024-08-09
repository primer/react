import React, {forwardRef, useContext} from 'react'
import type {IconButtonProps} from '../../Button'
import {IconButton} from '../../Button'
import {MarkdownEditorContext} from './_MarkdownEditorContext'

/**
 * @alias MarkdownEditor.ToolbarButton
 * @primerparentid drafts_markdown_editor
 */
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
      // Keeping the tooltip disable since it is not maintained anymore and its tests were failing.
      unsafeDisableTooltip
    />
  )
})
ToolbarButton.displayName = 'MarkdownEditor.ToolbarButton'
