import React, {forwardRef, useContext} from 'react'
import {MarkdownEditorContext} from './_MarkdownEditorContext'
import {Button, ButtonProps} from '../..'

export const Actions = ({children}: {children?: React.ReactNode}) => <>{children}</>
Actions.displayName = 'MarkdownEditor.Actions'

export const ActionButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {disabled} = useContext(MarkdownEditorContext)
  return <Button ref={ref} size="small" disabled={disabled} {...props} />
})
ActionButton.displayName = 'MarkdownEditor.ActionButton'
