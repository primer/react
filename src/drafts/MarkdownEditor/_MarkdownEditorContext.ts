import {createContext} from 'react'
import {FormattingTools} from './_useFormattingTools'

// For performance, the properties in context MUST NOT be values that change often - every time
// any of the properties change, all components including memoized ones will be re-rendered
type MarkdownEditorContextProps = {
  disabled: boolean
  condensed: boolean
  required: boolean
  formattingTools: FormattingTools | null
}

export const MarkdownEditorContext = createContext<MarkdownEditorContextProps>({
  disabled: false,
  condensed: false,
  required: false,
  formattingTools: null
})
