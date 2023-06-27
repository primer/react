import React from 'react'
import styled from 'styled-components'
import {XIcon} from '@primer/octicons-react'
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

const FileUploadContext = React.createContext({
  fileUploadId: '',
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

export type FileUploadProps = ComponentProps<typeof FileInputBase> & {
  buttonProps?: Omit<ComponentProps<typeof ButtonBase>, 'children'> & {children?: React.ReactNode}
  visuallyHiddenLabel?: string
  // Is this the best way to do this?
  fileProgress: (file: File) => number
}

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

export type FileUploadItemProps = {
  visuallyHidden?: boolean
} & SxProp &
  React.HTMLProps<HTMLLabelElement>

const FileUploadItem = ({children, visuallyHidden = false, ...rest}: React.PropsWithChildren<FileUploadLabelProps>) => {
  const {fileUploadId} = React.useContext(FileUploadContext)

  return (
    <VisuallyHidden isVisible={!visuallyHidden}>
      <label htmlFor={fileUploadId} {...rest}>
        {children}
      </label>
    </VisuallyHidden>
  )
}

const FileUpload = ({children, fileProgress, buttonProps, ...rest}: React.PropsWithChildren<FileUploadProps>) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files) {
      const fileList = Array.from(files)
      setUploadedFiles(fileList)
    }
  }

  const fileUploadId = useId()

  return (
    <FileUploadContext.Provider value={{fileUploadId}}>
      {children}
      <FileInputBase
        {...rest}
        id={fileUploadId}
        type="file"
        ref={fileInputRef}
        onChange={e => {
          handleFileUpload(e)
          rest.onChange?.(e)
        }}
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
        {buttonProps?.children ?? 'Upload File'}
      </ButtonBase>
      {uploadedFiles.length > 0 && (
        // TODO change aria-label based on design
        <UploadList aria-label="uploaded files...">
          {uploadedFiles.map(file => {
            return (
              <UploadItem key={file.name}>
                <Box display={'flex'} justifyContent={'space-between'} marginBottom={'8px'}>
                  <Text>{file.name}</Text>
                  <IconButton
                    aria-label={`remove ${file.name}`}
                    icon={XIcon}
                    onClick={e => {
                      if (fileInputRef.current) {
                        fileInputRef.current.files = null
                      }

                      // TODO: remove the file from the actual input fileList
                      setUploadedFiles(() => {
                        return uploadedFiles.filter(cur => {
                          return file.name !== cur.name
                        })
                      })
                    }}
                  />
                </Box>
                {/*  typically determine upload progress by */}
                <ProgressBar progress={fileProgress(file)} barSize={'default'} inline bg={'success.emphasis'} />
              </UploadItem>
            )
          })}
        </UploadList>
      )}
    </FileUploadContext.Provider>
  )
}

export default Object.assign(FileUpload, {
  Label: FileUploadLabel,
  Item: FileUploadItem,
})
