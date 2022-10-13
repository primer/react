/** This is the place where we keep components that are not part of the public
 *  api yet (not in main bundle). We don't recommend using it in production.
 *
 *  But, they are published on npm and you can import them for experimentation/feedback.
 *  example: import {ActionList} from '@primer/react/drafts
 */
export * from '../Dialog/Dialog'

export * from '../Hidden' // Will be moved from drafts to main bundle after utility is proven

export {default as InlineAutocomplete} from './InlineAutocomplete'
export type {
  InlineAutocompleteProps,
  ShowSuggestionsEvent,
  Suggestion,
  Suggestions,
  Trigger
} from './InlineAutocomplete'

export {default as MarkdownViewer} from './MarkdownViewer'
export type {MarkdownViewerProps, InteractiveMarkdownViewerProps} from './MarkdownViewer'

export {default as MarkdownEditor} from './MarkdownEditor'
export * from './MarkdownEditor'

export * from '../UnderlineNav2'

export * from './hooks'

export * from '../TreeView'

// TODO: Remove these components from the drafts bundle in the next major release
export * from '../NavList'
export * from '../SegmentedControl'
export * from '../SplitPageLayout'
