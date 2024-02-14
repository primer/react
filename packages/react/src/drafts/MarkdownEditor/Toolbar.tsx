import {FocusKeys} from '@primer/behaviors'
import {
  BoldIcon,
  CodeIcon,
  CrossReferenceIcon,
  HeadingIcon,
  ItalicIcon,
  LinkIcon,
  ListOrderedIcon,
  ListUnorderedIcon,
  MentionIcon,
  QuoteIcon,
  TasklistIcon,
} from '@primer/octicons-react'
import React, {memo, useContext, useRef} from 'react'

import {isMacOS} from '@primer/behaviors/utils'
import Box from '../../Box'
import {useFocusZone} from '../../hooks/useFocusZone'
import {MarkdownEditorContext} from './_MarkdownEditorContext'
import {SavedRepliesButton} from './_SavedReplies'
import {ToolbarButton} from './_ToolbarButton'

const Divider = () => {
  return (
    <Box
      sx={{
        display: 'inline-grid',
        margin: '0 var(--controlStack-medium-gap-condensed, 8px)',
        height: 'calc(var(--control-medium-size, 32px)/2)',
        borderLeft: 'var(--borderWidth-thin, 1px) solid var(--borderColor-muted)',
      }}
    />
  )
}

export const DefaultToolbarButtons = memo(() => {
  const {condensed, formattingToolsRef} = useContext(MarkdownEditorContext)

  const cmdOrCtrl = isMacOS() ? 'Cmd' : 'Ctrl'

  // Important: do not replace `() => ref.current?.format()` with `ref.current?.format` - it will refer to an outdated ref.current!
  return (
    <>
      <Box>
        <ToolbarButton
          onClick={() => formattingToolsRef.current?.header()}
          icon={HeadingIcon}
          aria-label="Add header text"
        />
        <ToolbarButton
          onClick={() => formattingToolsRef.current?.bold()}
          icon={BoldIcon}
          aria-label={`Bold (${cmdOrCtrl} + B)`}
        />
        <ToolbarButton
          onClick={() => formattingToolsRef.current?.italic()}
          icon={ItalicIcon}
          aria-label={`Italic (${cmdOrCtrl} + I)`}
        />
      </Box>
      <Box>
        <Divider />
        <ToolbarButton
          onClick={() => formattingToolsRef.current?.quote()}
          icon={QuoteIcon}
          aria-label={`Insert a quote (${cmdOrCtrl} + Shift + .)`}
        />
        <ToolbarButton
          onClick={() => formattingToolsRef.current?.code()}
          icon={CodeIcon}
          aria-label={`Insert code (${cmdOrCtrl} + E)`}
        />
        <ToolbarButton
          onClick={() => formattingToolsRef.current?.link()}
          icon={LinkIcon}
          aria-label={`Add a link (${cmdOrCtrl} + K)`}
        />
      </Box>
      <Box>
        <Divider />
        <ToolbarButton
          onClick={() => formattingToolsRef.current?.unorderedList()}
          icon={ListUnorderedIcon}
          aria-label={`Add a bulleted list (${cmdOrCtrl} + 8)`}
        />
        <ToolbarButton
          onClick={() => formattingToolsRef.current?.orderedList()}
          icon={ListOrderedIcon}
          aria-label={`Add a numbered list (${cmdOrCtrl} + Shift + 7)`}
        />
        <ToolbarButton
          onClick={() => formattingToolsRef.current?.taskList()}
          icon={TasklistIcon}
          aria-label={`Add a task list (${cmdOrCtrl} + Shift + L)`}
        />
      </Box>
      {!condensed && (
        <Box>
          <Divider />
          <ToolbarButton
            onClick={() => formattingToolsRef.current?.mention()}
            icon={MentionIcon}
            aria-label="Mention a user or team (@)"
          />
          <ToolbarButton
            onClick={() => formattingToolsRef.current?.reference()}
            icon={CrossReferenceIcon}
            aria-label="Reference an issue, pull request, or discussion (#)"
          />
        </Box>
      )}
      <SavedRepliesButton />
    </>
  )
})
DefaultToolbarButtons.displayName = 'MarkdownEditor.DefaultToolbarButtons'

export const CoreToolbar = ({children}: {children?: React.ReactNode}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useFocusZone({
    containerRef,
    focusInStrategy: 'closest',
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
    focusOutBehavior: 'wrap',
  })

  return (
    <Box
      ref={containerRef}
      aria-label="Formatting tools"
      role="toolbar"
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        gap: 0,
        alignItems: 'center',
        flexGrow: 1,
        borderBottom: '1px solid',
        borderBottomColor: 'border.muted',
        pl: 2,
        pr: 1,
      }}
    >
      {children}
    </Box>
  )
}

export const Toolbar = ({children}: {children?: React.ReactNode}) => <CoreToolbar>{children}</CoreToolbar>
Toolbar.displayName = 'MarkdownEditor.Toolbar'

export {ToolbarButton}
