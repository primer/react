import React, {memo} from 'react'
import {AlertIcon} from '@primer/octicons-react'

import {Spinner, ButtonProps, Box, Text} from '../..'
import {DefaultActionButtons} from './Actions'

const uploadingNote = ([current, total]: [number, number]) =>
  total === 1 ? `Uploading your file...` : `Uploading your files... (${current}/${total})`

export const Footer = ({
  footerButtons,
  actionButtons,
  uploadButtonProps,
  fileUploadProgress,
  fileDraggedOver,
  errorMessage,
  previewMode,
}: {
  footerButtons: React.ReactNode
  actionButtons: React.ReactNode
  uploadButtonProps: Partial<ButtonProps> | null
  fileUploadProgress?: [number, number]
  fileDraggedOver: boolean
  errorMessage?: string
  previewMode: boolean
}) => (
  <Box sx={{pt: 2, display: 'flex', gap: 2, justifyContent: 'space-between', minHeight: '36px'}} as="footer">
    <Box sx={{display: 'flex', gap: 1, alignItems: 'center', fontSize: 0}}>
      <Box sx={{display: 'flex', gap: 2}}>{footerButtons}</Box>
      {previewMode ? (
        <></>
      ) : fileUploadProgress ? (
        <Text sx={{py: 1, px: 2}}>
          <Spinner size="small" sx={{mr: 1, verticalAlign: 'text-bottom'}} /> {uploadingNote(fileUploadProgress)}
        </Text>
      ) : errorMessage ? (
        <ErrorMessage message={errorMessage} />
      ) : (
        <DefaultActionButtons uploadButtonProps={uploadButtonProps} fileDraggedOver={fileDraggedOver} />
      )}
    </Box>
    {!fileUploadProgress && <Box sx={{display: 'flex', gap: 2}}>{actionButtons}</Box>}
  </Box>
)

const ErrorMessage = memo(({message}: {message: string}) => (
  <Text sx={{py: 1, px: 2, color: 'danger.fg'}} aria-live="polite">
    <Text sx={{mr: 1}}>
      <AlertIcon size="small" />
    </Text>{' '}
    {message}
  </Text>
))
