import React from 'react'
import styled from 'styled-components'
import {XIcon, UploadIcon, FileIcon, SyncIcon} from '@primer/octicons-react'
import {ComponentProps} from '../utils/types'
import {useId} from '../hooks/useId'
import sx, {SxProp} from '../sx'
import Text from '../Text'
import {Button, IconButton} from '../Button'
import {highContrastStyles} from '../Button/styles'
import {globalFocusStyle} from '../internal/utils/getGlobalFocusStyles'
import {visuallyHiddenStyles} from '../internal/components/VisuallyHidden'
import {outlineOffset} from '../Button/types'
import VisuallyHidden from '../_VisuallyHidden'
import {ProgressBar} from '../ProgressBar'
import Box from '../Box/Box'
import {useSlots} from '../hooks/useSlots'
import Flash, {FlashProps} from '../Flash/Flash'

const FileUploadContext = React.createContext<{fileUploadId?: string; fileDescriptionId?: string}>({
  fileUploadId: undefined,
  fileDescriptionId: undefined,
})
const FileInputBase = styled.input<SxProp>`
  ${visuallyHiddenStyles}
  ${sx};
`

const ButtonBase = styled(Button)`
    input:focus + & {
        ${globalFocusStyle(outlineOffset)}
        // TODO: verify that high Contrast works!
        ${highContrastStyles},
    },
  ${sx}
`

const UploadList = styled.ul`
  padding-inline: 0;
`
const UploadItem = styled.li`
  list-style: none;
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
`

export type FileUploadLabelProps = {
  visuallyHidden?: boolean
} & SxProp &
  React.HTMLProps<HTMLLabelElement>

const FileUploadLabel = ({
  children,
  visuallyHidden = false,
  ...rest
}: React.PropsWithChildren<FileUploadLabelProps>) => {
  const {fileUploadId} = React.useContext(FileUploadContext)

  return (
    <VisuallyHidden isVisible={!visuallyHidden}>
      <label htmlFor={fileUploadId} {...rest}>
        {children}
      </label>
    </VisuallyHidden>
  )
}

export type FileUploadDescriptionTextProps = SxProp & React.HTMLProps<HTMLSpanElement>

const FileUploadDescriptionText = ({children}: React.PropsWithChildren<FileUploadDescriptionTextProps>) => {
  const {fileDescriptionId} = React.useContext(FileUploadContext)

  return <Text id={fileDescriptionId}>{children}</Text>
}

export type Status = 'error' | 'success'

export type FileUploadStatusProps = {
  status: Status
} & SxProp &
  Omit<FlashProps, 'variant'>

// TODO: aria-live="polite" or "assertive" on variant
// style based on validation status?
const FileUploadStatus = ({status, ...rest}: React.PropsWithChildren<FileUploadStatusProps>) => {
  return <Flash variant={status === 'success' ? 'success' : 'danger'} {...rest} />
}

export type FileUploadItemProps = ComponentProps<typeof UploadItem> & {
  file: File
  progress: number
  status?: Status
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
} & SxProp

const FileUploadItem = ({file, progress, status, onClick, ...rest}: React.PropsWithChildren<FileUploadItemProps>) => {
  const {name: fileName} = file

  return (
    <UploadItem {...rest}>
      <Box display={'flex'} justifyContent={'space-between'} marginBottom={'8px'}>
        <FileIcon size={16} />
        <Text>{fileName}</Text>
        {progress < 100 && status !== 'error' ? (
          <Text>{Math.ceil(progress)}% complete</Text>
        ) : (
          status && (
            <IconButton
              aria-label={`${status === 'success' ? 'Remove' : 'Retry'} ${fileName}`}
              icon={status === 'success' ? XIcon : SyncIcon}
              onClick={onClick}
            />
          )
        )}
      </Box>
      {/*  typically determine upload progress by */}
      <ProgressBar progress={progress} barSize={'default'} inline bg={'success.emphasis'} />
    </UploadItem>
  )
}

export type FileUploadProps = ComponentProps<typeof FileInputBase> & {
  buttonProps?: Omit<ComponentProps<typeof ButtonBase>, 'children'> & {children?: React.ReactNode}
  _slotsConfig?: Record<'label' | 'description' | 'status', React.ElementType>
}

const FileUpload = ({
  children,
  buttonProps,
  _slotsConfig: slotsConfig,
  ...restProps
}: React.PropsWithChildren<FileUploadProps>) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const fileUploadId = useId()
  const fileDescriptionId = useId()

  const [slots, rest] = useSlots(
    children,
    slotsConfig ?? {label: FileUploadLabel, description: FileUploadDescriptionText, status: FileUploadStatus},
  )

  return (
    <FileUploadContext.Provider value={{fileUploadId, fileDescriptionId}}>
      <Box display={'flex'} flexDirection={'column'}>
        {slots.label}
        {slots.description}
      </Box>
      <FileInputBase
        {...restProps}
        id={fileUploadId}
        aria-describedby={fileDescriptionId}
        type="file"
        ref={fileInputRef}
      />
      <ButtonBase
        {...buttonProps}
        type="button"
        aria-hidden
        tabIndex={-1}
        onClick={e => {
          fileInputRef.current?.click()
          buttonProps?.onClick?.(e)
        }}
      >
        <UploadIcon size={16} />
        {buttonProps?.children ?? 'Upload File'}
      </ButtonBase>
      {slots.status}
      {rest.length ? <UploadList aria-label="Selected files">{rest}</UploadList> : null}
    </FileUploadContext.Provider>
  )
}

export default Object.assign(FileUpload, {
  Label: FileUploadLabel,
  Description: FileUploadDescriptionText,
  Item: FileUploadItem,
  Status: FileUploadStatus,
})
