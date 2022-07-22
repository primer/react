import {createContext, RefObject} from 'react'
import {FormattingTools} from './FormattingTools'

type MarkdownEditorContextProps = {
  disabled: boolean
  condensed: boolean
  required: boolean
  formattingToolsRef: RefObject<FormattingTools>
}

export const MarkdownEditorContext = createContext<MarkdownEditorContextProps>({
  disabled: false,
  condensed: false,
  required: false,
  formattingToolsRef: {current: null}
})
