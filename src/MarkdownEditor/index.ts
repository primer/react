import _MarkdownEditor from './MarkdownEditor'
import {DefaultToolbarButtons, Toolbar, ToolbarButton} from './Toolbar'
import {ActionButton, Actions} from './Actions'
import {Label} from './Label'

export {MarkdownEditorProps} from './MarkdownEditor'

const MarkdownEditor = Object.assign(_MarkdownEditor, {
  Toolbar,
  ToolbarButton,
  DefaultToolbarButtons,
  ActionButton,
  Actions,
  Label
})
export default MarkdownEditor

export {
  Emoji,
  Mentionable,
  Reference,
  EmojiSuggestionHandler,
  ReferenceSuggestionHandler,
  MentionSuggestionHandler
} from './_useSuggestions'
export {FileUploadResult} from './_useFileHandling'
export {MarkdownViewMode} from './_ViewSwitch'
