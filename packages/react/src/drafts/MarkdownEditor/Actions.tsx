import React, {forwardRef, useContext} from 'react'
import {Button, ButtonProps} from '../../Button'
import {MarkdownEditorSlot} from './MarkdownEditor'
import {MarkdownEditorContext} from './_MarkdownEditorContext'

export const Actions = ({children}: {children?: React.ReactNode}) => (
  <MarkdownEditorSlot name="Actions">{children}</MarkdownEditorSlot>
)
Actions.displayName = 'MarkdownEditor.Actions'

export const ActionButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {disabled} = useContext(MarkdownEditorContext)
  return <Button ref={ref} size="small" disabled={disabled} {...props} />
})
ActionButton.displayName = 'MarkdownEditor.ActionButton'
