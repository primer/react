import React, {memo, forwardRef, useContext} from 'react'
import {PaperclipIcon} from '@primer/octicons-react'

import {Spinner, Box, Text} from '../..'
import type {ButtonProps} from '../../Button'
import {Button} from '../../Button'
import {MarkdownEditorContext} from './_MarkdownEditorContext'
import {useSlots} from '../../hooks/useSlots'

const uploadingNote = ([current, total]: [number, number]) =>
  total === 1 ? `Uploading your file…` : `Uploading your files… (${current}/${total})`

export const CoreFooter = ({children}: {children: React.ReactNode}) => {
  const [slots, childrenWithoutSlots] = useSlots(children, {
    footerButtons: FooterButton,
  })

  const {fileUploadProgress, previewMode} = useContext(MarkdownEditorContext)

  return (
    <Box
      sx={{pt: 2, display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center', minHeight: '36px'}}
      as="footer"
    >
      <Box sx={{display: 'flex', gap: 1, alignItems: 'center', fontSize: 0}}>
        {previewMode ? (
          <></>
        ) : fileUploadProgress ? (
          <Text sx={{py: 1, px: 2, color: 'fg.muted'}}>
            <Spinner size="small" sx={{mr: 1, verticalAlign: 'text-bottom'}} /> {uploadingNote(fileUploadProgress)}
          </Text>
        ) : null}
        {slots.footerButtons && <Box sx={{display: 'flex', gap: 2}}>{slots.footerButtons}</Box>}
        <DefaultFooterButtons />
      </Box>
      {!fileUploadProgress && <Box sx={{display: 'flex', gap: 2}}>{childrenWithoutSlots}</Box>}
    </Box>
  )
}

export const Footer = ({children}: {children?: React.ReactNode}) => <CoreFooter>{children}</CoreFooter>
Footer.displayName = 'MarkdownEditor.Footer'

export const FooterButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {disabled} = useContext(MarkdownEditorContext)
  return <Button ref={ref} size="small" disabled={disabled} {...props} />
})
FooterButton.displayName = 'MarkdownEditor.FooterButton'

const DefaultFooterButtons = memo(() => {
  const {uploadButtonProps, fileDraggedOver} = useContext(MarkdownEditorContext)

  return uploadButtonProps ? <FileUploadButton fileDraggedOver={fileDraggedOver} {...uploadButtonProps} /> : null
})
DefaultFooterButtons.displayName = 'MarkdownEditor.DefaultFooterButtons'

const FileUploadButton = memo(({fileDraggedOver, ...props}: Partial<ButtonProps> & {fileDraggedOver: boolean}) => {
  const {condensed, disabled} = useContext(MarkdownEditorContext)

  return (
    <Button
      variant="invisible"
      leadingVisual={PaperclipIcon}
      size="small"
      sx={{color: 'fg.muted', fontWeight: 'normal', px: 2}}
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
