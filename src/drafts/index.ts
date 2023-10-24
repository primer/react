/**
 * This is the place where we keep components that are not part of the public
 * api yet (not in main bundle). We don't recommend using it in production.
 *
 * But, they are published on npm and you can import them for experimentation/feedback.
 * example: import {ActionList} from '@primer/react/drafts
 */

export {Blankslate} from '../Blankslate'
export type {BlankslateProps} from '../Blankslate'

export {DataTable, Table, createColumnHelper} from '../DataTable'
export type {
  DataTableProps,
  TableProps,
  TableHeadProps,
  TableBodyProps,
  TableRowProps,
  TableHeaderProps,
  TableCellProps,
  TableContainerProps,
  TableTitleProps,
  TableSubtitleProps,
  TableActionsProps,
  Column,
} from '../DataTable'

export * from '../Dialog/Dialog'

export {default as InlineAutocomplete} from './InlineAutocomplete'
export type {
  InlineAutocompleteProps,
  ShowSuggestionsEvent,
  Suggestion,
  Suggestions,
  Trigger,
} from './InlineAutocomplete'

export {default as MarkdownViewer} from './MarkdownViewer'
export type {MarkdownViewerProps, InteractiveMarkdownViewerProps} from './MarkdownViewer'

export {default as MarkdownEditor} from './MarkdownEditor'
export * from './MarkdownEditor'

export * from '../UnderlineNav2'

export * from '../PageHeader'

export * from '../Hidden'

export * from './hooks'

export * from './SelectPanel2'

// TODO: Remove these components from the drafts bundle in the next major release
export * from '../TreeView'
export * from '../NavList'
export * from '../SegmentedControl'
export * from '../SplitPageLayout'
export * from './Tooltip'

// CSS Experiment
// export * from './CSSComponent'
// export * from './Button2'
