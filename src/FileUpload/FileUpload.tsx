import React from 'react'
import styled from 'styled-components'
import {XIcon, UploadIcon, FileIcon, SyncIcon, StopIcon, CheckIcon} from '@primer/octicons-react'
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
import {useRefObjectAsForwardedRef} from '../hooks'

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
        ${highContrastStyles},
    },
  ${sx}
`

const ListContainer = styled.ul`
  padding-inline: 0;
  margin: 0;
`

const ListItem = styled.li<SxProp>`
  list-style: none;
  display: flex;
  flex-direction: column;
  ${sx};
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
    <VisuallyHidden isVisible={!visuallyHidden} sx={{fontSize: 2, fontWeight: 3}}>
      <label htmlFor={fileUploadId} {...rest}>
        {children}
      </label>
    </VisuallyHidden>
  )
}

export type FileUploadDescriptionTextProps = SxProp & React.HTMLProps<HTMLSpanElement>

const FileUploadDescriptionText = ({children}: React.PropsWithChildren<FileUploadDescriptionTextProps>) => {
  const {fileDescriptionId} = React.useContext(FileUploadContext)

  return (
    <Text fontSize={1} id={fileDescriptionId}>
      {children}
    </Text>
  )
}

export type Status = 'error' | 'success'

export type FileUploadStatusProps = {
  status: Status
} & SxProp &
  Omit<FlashProps, 'variant'>

const FileUploadStatus = ({status, children, ...rest}: React.PropsWithChildren<FileUploadStatusProps>) => {
  const isSuccess = status === 'success'
  return (
    <Flash variant={isSuccess ? 'success' : 'danger'} sx={{marginBottom: 2}} {...rest}>
      <Box
        as={Text}
        alignItems={'center'}
        display={'flex'}
        fontSize={2}
        sx={isSuccess ? {} : {'&>svg': {fill: 'danger.fg'}}}
      >
        {isSuccess ? <CheckIcon size={16} /> : <StopIcon size={16} />}
        {children}
      </Box>
    </Flash>
  )
}

export type FileUploadItemProps = ComponentProps<typeof ListItem> & {
  file: File
  progress: number
  progressBarRef?: React.RefObject<HTMLSpanElement>
  status?: Status
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
} & SxProp

const FileUploadItem = ({
  file,
  progress,
  status,
  onClick,
  progressBarRef,
  ...rest
}: React.PropsWithChildren<FileUploadItemProps>) => {
  const {name: fileName} = file
  const fileNameId = useId()
  const inProgress = progress < 100 && status !== 'error'

  return (
    <ListItem {...rest} sx={{marginBottom: 2, position: 'relative'}}>
      <Box
        display={'grid'}
        alignItems={'center'}
        gridTemplateColumns={'1fr max-content'}
        sx={{gap: 2, borderRadius: 2, padding: 2, borderColor: 'border.muted'}}
        border={'2px solid'}
      >
        <Box display={'flex'} alignItems={'center'} sx={{gap: 2}}>
          <FileIcon size={24} />
          <Text sx={{fontSize: 2, wordBreak: 'break-word'}} id={fileNameId}>
            {fileName}
          </Text>
        </Box>
        {inProgress ? (
          <Text aria-hidden sx={{fontSize: 2}}>
            {Math.ceil(progress)}% complete
          </Text>
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
      {inProgress ? (
        <ProgressBar
          ref={progressBarRef}
          tabIndex={-1}
          progress={progress}
          barSize={'default'}
          aria-labelledby={fileNameId}
          bg={'accent.fg'}
          inline
          sx={{
            borderRadius: '0 0 var(--borderRadius-small) var(--borderRadius-small)',
            height: '4px',
            position: 'absolute',
            bottom: '0',
            width: '100%',
          }}
        />
      ) : null}
    </ListItem>
  )
}

export type FileUploadProps = ComponentProps<typeof FileInputBase> & {
  buttonProps?: Omit<ComponentProps<typeof ButtonBase>, 'children'> & {children?: React.ReactNode}
  _slotsConfig?: Record<'label' | 'description' | 'status', React.ElementType>
}

const FileUpload = React.forwardRef(
  (
    {children, buttonProps, _slotsConfig: slotsConfig, ...restProps}: React.PropsWithChildren<FileUploadProps>,
    forwardedRef,
  ) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    useRefObjectAsForwardedRef(forwardedRef, fileInputRef)

    const fileUploadId = useId()
    const fileDescriptionId = useId()

    const [slots, rest] = useSlots(
      children,
      slotsConfig ?? {label: FileUploadLabel, description: FileUploadDescriptionText, status: FileUploadStatus},
    )

    console.log(slots.status)

    return (
      <FileUploadContext.Provider value={{fileUploadId, fileDescriptionId}}>
        <Box display={'flex'} flexDirection={'column'} sx={{gap: 1, marginBottom: 2}}>
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
          aria-hidden={true}
          tabIndex={-1}
          onClick={e => {
            fileInputRef.current?.click()
            buttonProps?.onClick?.(e)
          }}
          sx={{marginBottom: 2}}
        >
          <UploadIcon size={16} />
          {buttonProps?.children ?? 'Upload File'}
        </ButtonBase>
        <Box display={'flex'} flexDirection="column" sx={{gap: 2}}>
          {slots.status}
          {rest.length ? <ListContainer aria-label="Selected files">{rest}</ListContainer> : null}
        </Box>
      </FileUploadContext.Provider>
    )
  },
)

export default Object.assign(FileUpload, {
  Label: FileUploadLabel,
  Description: FileUploadDescriptionText,
  Item: FileUploadItem,
  Status: FileUploadStatus,
})
