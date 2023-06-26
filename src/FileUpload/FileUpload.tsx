import React from 'react'
import styled from 'styled-components'
import {ComponentProps} from '../utils/types'
import sx, {SxProp} from '../sx'
import {Button} from '../Button'
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

// TODO: Figure out how people will add props to the button or the input...
// Right now they can't add props to the button, but they can add props to the input
// (ComponentProps<typeof FileUploadBase> = any input props. i.e. accepts, multiple etc.)
export type FileUploadProps = ComponentProps<typeof FileUploadBase>

const FileUpload = ({children, ...rest}: React.PropsWithChildren<FileUploadProps>) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  return (
    <>
      <FileUploadBase className="sr-only" {...rest} type="file" ref={fileInputRef} />
      <ButtonBase
        type="button"
        aria-hidden
        tabIndex={-1}
        onClick={() => {
          fileInputRef.current?.click()
        }}
      >
        Upload File
      </ButtonBase>
    </>
  )
}

export default FileUpload
