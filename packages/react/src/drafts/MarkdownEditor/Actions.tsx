import React, {forwardRef, useContext} from 'react'
import type {ButtonProps} from '../../Button'
import {Button} from '../../Button'
import {MarkdownEditorContext} from './_MarkdownEditorContext'

/**
 * @alias MarkdownEditor.Actions
 * @primerparentid drafts_markdown_editor
 */
export const Actions = ({
  children,
}: {
  /** Markdown editor actions */
  children?: React.ReactNode
}) => <>{children}</>
Actions.displayName = 'MarkdownEditor.Actions'

/**
 * @alias MarkdownEditor.ActionButton
 * @primerparentid drafts_markdown_editor
 */
export const ActionButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {disabled} = useContext(MarkdownEditorContext)
  return <Button ref={ref} disabled={disabled} {...props} />
})
ActionButton.displayName = 'MarkdownEditor.ActionButton'
