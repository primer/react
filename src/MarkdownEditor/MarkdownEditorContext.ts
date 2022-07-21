import {createContext, RefObject} from 'react'
import {FormattingTools} from './FormattingTools'

type MarkdownEditorContextProps = {
  disabled: boolean
  condensed: boolean
  formattingToolsRef: RefObject<FormattingTools>
}

export const MarkdownEditorContext = createContext<MarkdownEditorContextProps>({
  disabled: false,
  condensed: false,
  formattingToolsRef: {current: null}
})
