import {FocusKeys} from '@primer/behaviors'
import {
  BoldIcon,
  CodeIcon,
  CrossReferenceIcon,
  HeadingIcon,
  Icon,
  ItalicIcon,
  LinkIcon,
  ListOrderedIcon,
  ListUnorderedIcon,
  MentionIcon,
  QuoteIcon,
  TasklistIcon
} from '@primer/octicons-react'
import React, {forwardRef, useImperativeHandle, useRef} from 'react'

import Box from '../Box'
import {useFocusZone} from '../hooks/useFocusZone'
import {MarkdownToolbarButtonName} from './markdown-toolbar-element'
import '@github/markdown-toolbar-element'
import {useCombinedRefs} from '../hooks/useCombinedRefs'
import {IconButton} from '../Button'

interface MarkdownToolbarProps {
  forInputId: string
  disabled?: boolean
  condensed?: boolean
}

export interface MarkdownToolbar {
  header: () => void
  bold: () => void
  italic: () => void
  quote: () => void
  code: () => void
  link: () => void
  unorderedList: () => void
  orderedList: () => void
  taskList: () => void
  mention: () => void
  reference: () => void
}

export const MarkdownToolbar = forwardRef<MarkdownToolbar, MarkdownToolbarProps>(
  ({forInputId, disabled, condensed}, forwardedRef) => {
    const containerRef = useRef<HTMLDivElement>(null)

    const headerRef = useRef<HTMLElement>(null)
    const boldRef = useRef<HTMLElement>(null)
    const italicRef = useRef<HTMLElement>(null)
    const quoteRef = useRef<HTMLElement>(null)
    const codeRef = useRef<HTMLElement>(null)
    const linkRef = useRef<HTMLElement>(null)
    const unorderedListRef = useRef<HTMLElement>(null)
    const orderedListRef = useRef<HTMLElement>(null)
    const taskListRef = useRef<HTMLElement>(null)
    const mentionRef = useRef<HTMLElement>(null)
    const referenceRef = useRef<HTMLElement>(null)

    useImperativeHandle(forwardedRef, () => ({
      header: () => headerRef.current?.click(),
      bold: () => boldRef.current?.click(),
      italic: () => italicRef.current?.click(),
      quote: () => quoteRef.current?.click(),
      code: () => codeRef.current?.click(),
      link: () => linkRef.current?.click(),
      unorderedList: () => unorderedListRef.current?.click(),
      orderedList: () => orderedListRef.current?.click(),
      taskList: () => taskListRef.current?.click(),
      mention: () => mentionRef.current?.click(),
      reference: () => referenceRef.current?.click()
    }))

    useFocusZone({
      containerRef,
      focusInStrategy: 'closest',
      bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
      focusOutBehavior: 'wrap'
    })

    return (
      <markdown-toolbar for={forInputId} disabled={disabled} aria-label="Formatting tools">
        <Box
          sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: condensed ? 0 : 3}}
          ref={containerRef}
        >
          <Box>
            <ToolbarButton
              ref={headerRef}
              element="md-header"
              icon={HeadingIcon}
              label="Add header text"
              disabled={disabled}
            />
            <ToolbarButton
              ref={boldRef}
              element="md-bold"
              icon={BoldIcon}
              label="Add bold text"
              shortcut="{CMD_CTRL}+B"
              disabled={disabled}
            />
            <ToolbarButton
              ref={italicRef}
              element="md-italic"
              icon={ItalicIcon}
              label="Add italic text"
              shortcut="{CMD_CTRL}+I"
              disabled={disabled}
            />
          </Box>
          <Box>
            <ToolbarButton
              ref={quoteRef}
              element="md-quote"
              icon={QuoteIcon}
              label="Insert a quote"
              shortcut="{CMD_CTRL}+Shift+."
              disabled={disabled}
            />
            <ToolbarButton
              ref={codeRef}
              element="md-code"
              icon={CodeIcon}
              label="Insert code"
              shortcut="{CMD_CTRL}+E"
              disabled={disabled}
            />
            <ToolbarButton
              ref={linkRef}
              element="md-link"
              icon={LinkIcon}
              label="Add a link"
              shortcut="{CMD_CTRL}+K"
              disabled={disabled}
            />
          </Box>
          <Box>
            <ToolbarButton
              ref={unorderedListRef}
              element="md-unordered-list"
              icon={ListUnorderedIcon}
              label="Add a bulleted list"
              shortcut="{CMD_CTRL}+8"
              disabled={disabled}
            />
            <ToolbarButton
              ref={orderedListRef}
              element="md-ordered-list"
              icon={ListOrderedIcon}
              label="Add a numbered list"
              shortcut="{CMD_CTRL}+Shift+7"
              disabled={disabled}
            />
            <ToolbarButton
              ref={taskListRef}
              element="md-task-list"
              icon={TasklistIcon}
              label="Add a task list"
              shortcut="{CMD_CTRL}+Shift+L"
              disabled={disabled}
            />
          </Box>
          {!condensed && (
            <Box>
              <ToolbarButton
                ref={mentionRef}
                element="md-mention"
                icon={MentionIcon}
                label="Mention a user or team"
                shortcut="@"
                disabled={disabled}
              />
              <ToolbarButton
                ref={referenceRef}
                element="md-ref"
                icon={CrossReferenceIcon}
                label="Reference an issue, pull request, or discussion"
                shortcut="#"
                disabled={disabled}
              />
            </Box>
          )}
        </Box>
      </markdown-toolbar>
    )
  }
)
MarkdownToolbar.displayName = 'MarkdownToolbar'

interface ToolbarButtonProps {
  element: MarkdownToolbarButtonName
  icon: Icon
  disabled?: boolean
  label: string
  shortcut?: string
}

const ToolbarButton = forwardRef<HTMLElement, ToolbarButtonProps>(
  ({element: UnderlyingElement, icon, label, shortcut, disabled}, forwardedRef) => {
    const ref = useCombinedRefs(forwardedRef)

    // Simulate a click on the underlying element but don't actually render it (because we don't want to
    // use the styling or the focus handling that the element provides by default)
    return (
      <>
        <UnderlyingElement ref={ref} style={{display: 'none'}} />
        <IconButton
          variant="invisible"
          icon={icon}
          sx={{color: 'fg.default'}}
          disabled={disabled}
          aria-label={`${label}${shortcut ? ` (${shortcut})` : ''}`}
          onClick={() => ref.current?.click()}
          // Prevent focus leaving input:
          onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
        />
      </>
    )
  }
)
ToolbarButton.displayName = 'ToolbarButton'
