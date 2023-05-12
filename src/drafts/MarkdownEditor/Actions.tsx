import React, {memo, forwardRef, useContext} from 'react'
import {MarkdownEditorContext} from './_MarkdownEditorContext'
import {Button, ButtonProps, LinkButton, Box, Text} from '../..'
import {ImageIcon, MarkdownIcon} from '@primer/octicons-react'

export const Actions = ({children}: {children?: React.ReactNode}) => <>{children}</>
Actions.displayName = 'MarkdownEditor.Actions'

export const ActionButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {disabled} = useContext(MarkdownEditorContext)
  return <Button ref={ref} size="small" disabled={disabled} {...props} />
})
ActionButton.displayName = 'MarkdownEditor.ActionButton'

export const DefaultActionButtons = memo(
  ({
    uploadButtonProps,
    fileDraggedOver,
  }: {
    uploadButtonProps: Partial<ButtonProps> | null
    fileDraggedOver: boolean
  }) => (
    <>
      <MarkdownSupportedHint />

      {uploadButtonProps && (
        <>
          <VisualSeparator />
          <FileUploadButton fileDraggedOver={fileDraggedOver} {...uploadButtonProps} />
        </>
      )}
    </>
  ),
)
DefaultActionButtons.displayName = 'MarkdownEditor.DefaultActionButtons'

const FileUploadButton = memo(({fileDraggedOver, ...props}: Partial<ButtonProps> & {fileDraggedOver: boolean}) => {
  const {condensed, disabled} = useContext(MarkdownEditorContext)

  return (
    <Button
      variant="invisible"
      leadingIcon={ImageIcon}
      size="small"
      sx={{color: 'fg.default', fontWeight: fileDraggedOver ? 'bold' : 'normal', px: 2}}
      onMouseDown={(e: React.MouseEvent) => {
        // Prevent pulling focus from the textarea
        e.preventDefault()
      }}
      disabled={disabled}
      {...props}
    >
      {condensed ? 'Add files' : fileDraggedOver ? 'Drop to add files' : 'Paste, drop, or click to add files'}
    </Button>
  )
})

const VisualSeparator = memo(() => (
  <Box sx={{borderRightStyle: 'solid', borderRightWidth: 1, borderRightColor: 'border.muted', height: '100%'}} />
))

const MarkdownSupportedHint = memo(() => {
  const {condensed} = useContext(MarkdownEditorContext)

  return (
    <LinkButton
      leadingIcon={MarkdownIcon}
      variant="invisible"
      size="small"
      sx={{color: 'inherit', fontWeight: 'normal', px: 2}}
      href="https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
      target="_blank"
      // The markdown editor aria-description already describes it as Markdown editor, so it's
      // redundant to say Markdown is supported again here. However for sighted users, they
      // cannot see the aria-description so this is a useful hint for them. So the aria-label
      // is different from the visible text content.
      aria-label="Markdown documentation"
    >
      {!condensed && <Text aria-hidden>Markdown is supported</Text>}
    </LinkButton>
  )
})
