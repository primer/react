import {createContext, RefObject} from 'react'
import {FormattingTools} from './_FormattingTools'
import {ButtonProps} from '../Button2'

// For performance, the properties in context MUST NOT be values that change often - every time
// any of the properties change, all components including memoized ones will be re-rendered
type MarkdownEditorContextProps = {
  disabled: boolean
  condensed: boolean
  required: boolean
  formattingToolsRef: RefObject<FormattingTools>
  uploadButtonProps: Partial<ButtonProps> | null
  fileUploadProgress?: [number, number]
  fileDraggedOver: boolean
  errorMessage?: string
  previewMode: boolean
}

export const MarkdownEditorContext = createContext<MarkdownEditorContextProps>({
  disabled: false,
  condensed: false,
  required: false,
  formattingToolsRef: {current: null},
  uploadButtonProps: null,
  fileDraggedOver: false,
  previewMode: false,
})
