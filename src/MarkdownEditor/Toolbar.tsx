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
  TasklistIcon
} from '@primer/octicons-react'
import React, {forwardRef, useContext, useRef} from 'react'

import '@github/markdown-toolbar-element'
import {isMacOS} from '@primer/behaviors/dist/esm/utils'
import Box from '../Box'
import {IconButton, IconButtonProps} from '../Button'
import {useFocusZone} from '../hooks/useFocusZone'
import {MarkdownEditorSlot} from './MarkdownEditor'
import {MarkdownEditorContext} from './MarkdownEditorContext'

export const ToolbarButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
  const {disabled} = useContext(MarkdownEditorContext)

  return (
    <IconButton
      ref={ref}
      variant="invisible"
      disabled={disabled}
      // Prevent focus leaving input:
      onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
      {...props}
      sx={{color: 'fg.default', ...props.sx}}
    />
  )
})

export const DefaultToolbarButtons = () => {
  const {condensed, formattingToolsRef} = useContext(MarkdownEditorContext)

  const cmdOrCtrl = isMacOS() ? 'Cmd' : 'Ctrl'

  return (
    formattingToolsRef.current && (
      <>
        <Box>
          <ToolbarButton onClick={formattingToolsRef.current.header} icon={HeadingIcon} label="Add header text" />
          <ToolbarButton onClick={formattingToolsRef.current.bold} icon={BoldIcon} label={`Bold (${cmdOrCtrl} + B)`} />
          <ToolbarButton
            onClick={formattingToolsRef.current.italic}
            icon={ItalicIcon}
            label={`Italic (${cmdOrCtrl} + I)`}
          />
        </Box>
        <Box>
          <ToolbarButton
            onClick={formattingToolsRef.current.quote}
            icon={QuoteIcon}
            label={`Insert a quote (${cmdOrCtrl} + Shift + .)`}
          />
          <ToolbarButton
            onClick={formattingToolsRef.current.code}
            icon={CodeIcon}
            label={`Insert code (${cmdOrCtrl} + E)`}
          />
          <ToolbarButton
            onClick={formattingToolsRef.current.link}
            icon={LinkIcon}
            label={`Add a link (${cmdOrCtrl} + K)`}
          />
        </Box>
        <Box>
          <ToolbarButton
            onClick={formattingToolsRef.current.unorderedList}
            icon={ListUnorderedIcon}
            label={`Add a bulleted list (${cmdOrCtrl} + 8)`}
          />
          <ToolbarButton
            onClick={formattingToolsRef.current.orderedList}
            icon={ListOrderedIcon}
            label={`Add a numbered list (${cmdOrCtrl} + Shift + 7)`}
          />
          <ToolbarButton
            onClick={formattingToolsRef.current.taskList}
            icon={TasklistIcon}
            label={`Add a task list (${cmdOrCtrl} + Shift + L)`}
          />
        </Box>
        {!condensed && (
          <Box>
            <ToolbarButton
              onClick={formattingToolsRef.current.mention}
              icon={MentionIcon}
              label="Mention a user or team (@)"
            />
            <ToolbarButton
              onClick={formattingToolsRef.current.reference}
              icon={CrossReferenceIcon}
              label="Reference an issue, pull request, or discussion (#)"
            />
          </Box>
        )}
      </>
    )
  )
}

export const CoreToolbar = ({children}: {children?: React.ReactNode}) => {
  const {condensed} = useContext(MarkdownEditorContext)

  const containerRef = useRef<HTMLDivElement>(null)

  useFocusZone({
    containerRef,
    focusInStrategy: 'closest',
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
    focusOutBehavior: 'wrap'
  })

  return (
    <Box
      ref={containerRef}
      aria-label="Formatting tools"
      role="toolbar"
      sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: condensed ? 0 : 3}}
    >
      {children}
    </Box>
  )
}

export const Toolbar = ({children}: {children?: React.ReactNode}) => (
  <MarkdownEditorSlot name="Toolbar">
    <CoreToolbar>{children}</CoreToolbar>
  </MarkdownEditorSlot>
)
