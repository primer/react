import React from 'react'
import styled from 'styled-components'
import {XIcon} from '@primer/octicons-react'
import {ComponentProps} from '../utils/types'
import sx, {SxProp} from '../sx'
import Text from '../Text'
import {Button, IconButton} from '../Button'
import {highContrastStyles} from '../Button/styles'
import {globalFocusStyle} from '../internal/utils/getGlobalFocusStyles'
import {visuallyHiddenStyles} from '../internal/components/VisuallyHidden'
import {outlineOffset} from '../Button/types'

const FileUploadBase = styled.input<SxProp>`
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
  justify-content: space-between;
`

export type FileUploadProps = ComponentProps<typeof FileUploadBase> & {
  buttonProps: ComponentProps<typeof ButtonBase>
}

const FileUpload = ({children, buttonProps, ...rest}: React.PropsWithChildren<FileUploadProps>) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const fileList = Array.from(files)
      setUploadedFiles(fileList)
    }
  }

  return (
    <>
      <FileUploadBase className="sr-only" {...rest} type="file" ref={fileInputRef} onChange={handleFileUpload} />
      <ButtonBase
        type="button"
        aria-hidden
        tabIndex={-1}
        onClick={() => {
          fileInputRef.current?.click()
        }}
        {...buttonProps}
      >
        Upload File
      </ButtonBase>
      {uploadedFiles.length > 0 && (
        // TODO change aria-label based on design
        <UploadList aria-label="uploaded files...">
          {uploadedFiles.map(file => (
            <UploadItem key={file.name}>
              <Text>{file.name}</Text>
              <IconButton
                aria-label={`remove ${file.name}`}
                icon={XIcon}
                onClick={() =>
                  setUploadedFiles(
                    uploadedFiles.filter(file => {
                      return file.name !== file.name
                    }),
                  )
                }
              />
            </UploadItem>
          ))}
        </UploadList>
      )}
    </>
  )
}

export default FileUpload
