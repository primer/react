import React, {forwardRef, useContext} from 'react'
import type {ButtonProps} from '../../Button'
import {Button} from '../../Button'
import {MarkdownEditorContext} from './_MarkdownEditorContext'

export const Actions = ({children}: {children?: React.ReactNode}) => <>{children}</>
Actions.displayName = 'MarkdownEditor.Actions'

export const ActionButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {disabled} = useContext(MarkdownEditorContext)
  return <Button ref={ref} disabled={disabled} {...props} />
})
ActionButton.displayName = 'MarkdownEditor.ActionButton'
