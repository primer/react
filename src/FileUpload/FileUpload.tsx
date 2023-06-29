import React from 'react'
import styled from 'styled-components'
import {XIcon, UploadIcon, FileIcon} from '@primer/octicons-react'
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
import Flash from '../Flash/Flash'

const FileUploadContext = React.createContext<{fileUploadId?: string; fileStatusId?: string; fileName?: string}>({
  fileName: undefined,
  fileUploadId: undefined,
  fileStatusId: undefined,
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

export type FileUploadDescriptionTextProps = SxProp & React.HTMLProps<HTMLParagraphElement>

const FileUploadDescriptionText = ({children}: React.PropsWithChildren<FileUploadDescriptionTextProps>) => {
  return <Text>{children}</Text>
}

export type FileUploadStatusProps = {
  status: 'unsupported' | 'error' | 'success'
} & SxProp

// TODO: aria-live="polite" or "assertive" on variant
// style based on validation status?
const FileUploadStatus = ({status, ...rest}: React.PropsWithChildren<FileUploadStatusProps>) => {
  const {fileStatusId} = React.useContext(FileUploadContext)
  // TODO: Use the context provider to get the file name
  // const {fileName} = React.useContext(fileName)
  const fileName = 'test file name'

  if (status === 'unsupported') {
    return (
      <Flash variant="danger" id={fileStatusId} {...rest}>
        {fileName} not supported. Upload a different file.
      </Flash>
    )
  } else if (status === 'error') {
    return (
      <Flash variant="danger" id={fileStatusId} {...rest}>
        {fileName} could not be added. Please refresh.
      </Flash>
    )
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  } else if (status === 'success') {
    return (
      <Flash variant="success" id={fileStatusId} {...rest}>
        {fileName} successfully added!
      </Flash>
    )
  } else {
    return null
  }
}

export type FileUploadItemProps = ComponentProps<typeof UploadItem> & {
  file: File
  progress: number
  onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
} & SxProp

const FileUploadItem = ({file, progress, onRemove, ...rest}: React.PropsWithChildren<FileUploadItemProps>) => {
  const {name: fileName} = file

  return (
    <UploadItem {...rest}>
      <Box display={'flex'} justifyContent={'space-between'} marginBottom={'8px'}>
        <FileIcon size={16} />
        <Text>{fileName}</Text>
        {progress < 100 ? <Text>{Math.ceil(progress)}% complete</Text> : null}
        <IconButton
          aria-label={`remove ${fileName}`}
          icon={XIcon}
          onClick={e => {
            onRemove(e)
          }}
        />
      </Box>
      {/*  typically determine upload progress by */}
      <ProgressBar progress={progress} barSize={'default'} inline bg={'success.emphasis'} />
    </UploadItem>
  )
}

export type FileUploadProps = ComponentProps<typeof FileInputBase> & {
  buttonProps?: Omit<ComponentProps<typeof ButtonBase>, 'children'> & {children?: React.ReactNode}
  _slotsConfig?: Record<'label' | 'description', React.ElementType>
}

const FileUpload = ({
  children,
  buttonProps,
  _slotsConfig: slotsConfig,
  ...restProps
}: React.PropsWithChildren<FileUploadProps>) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const fileUploadId = useId()
  const fileStatusId = useId()

  const [slots, rest] = useSlots(
    children,
    slotsConfig ?? {label: FileUploadLabel, description: FileUploadDescriptionText},
  )

  return (
    <FileUploadContext.Provider value={{fileUploadId, fileStatusId}}>
      <Box display={'flex'} flexDirection={'column'}>
        {slots.label}
        {slots.description}
      </Box>
      <FileInputBase {...restProps} id={fileUploadId} aria-describedby={fileStatusId} type="file" ref={fileInputRef} />
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
      {/* TODO: only display if there is a status */}
      <FileUploadStatus status="success" />
      {rest.length ? <UploadList aria-label="Uploaded files">{rest}</UploadList> : null}
    </FileUploadContext.Provider>
  )
}

export default Object.assign(FileUpload, {
  Description: FileUploadDescriptionText,
  Label: FileUploadLabel,
  Item: FileUploadItem,
})
