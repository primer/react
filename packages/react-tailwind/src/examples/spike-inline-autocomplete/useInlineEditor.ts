'use client'

import React from 'react'
import type {FloatingVirtualAnchor} from '../../utils/types'
import {measureCaret} from './caret'

export interface Suggestion {
  label: string
  trigger: string
}

const suggestions: readonly Suggestion[] = [
  {trigger: '@', label: 'mona'},
  {trigger: '@', label: 'hubot'},
  {trigger: '#', label: '123'},
  {trigger: '#', label: '124'},
  {trigger: ':', label: 'smile'},
  {trigger: ':', label: 'sparkles'},
  {trigger: '/', label: 'assign'},
  {trigger: '/', label: 'close'},
]

export function parseTrigger(text: string, start: number, end: number, slash: boolean) {
  if (start !== end) return null
  const match = /(?:^|\s)([@#:/])([\p{L}\p{N}_-]*)$/u.exec(text.slice(0, start))
  if (!match || (slash ? match[1] !== '/' : match[1] === '/')) return null
  return {trigger: match[1], query: match[2], start: start - match[2].length - 1, end: start}
}

type KeyEvent = React.KeyboardEvent & {preventBaseUIHandler?: () => void}

/** Consumer-owned editor logic, shared unchanged by A/B/C so only composition differs. */
export function useInlineEditor(slash = false) {
  const id = React.useId()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const pendingCaret = React.useRef<number | null>(null)
  const [text, setText] = React.useState('')
  const [selection, setSelection] = React.useState({start: 0, end: 0})
  const [dismissed, setDismissed] = React.useState(false)
  const [composing, setComposing] = React.useState(false)
  const [highlighted, setHighlighted] = React.useState<Suggestion>()
  const [anchor, setAnchor] = React.useState<FloatingVirtualAnchor | null>(null)
  const [command, setCommand] = React.useState('')
  const match = parseTrigger(text, selection.start, selection.end, slash)
  const items = match
    ? suggestions.filter(item => item.trigger === match.trigger && item.label.startsWith(match.query.toLowerCase()))
    : []
  const open = !!match && items.length > 0 && !dismissed && !composing

  function refresh(input: HTMLTextAreaElement) {
    setSelection({start: input.selectionStart, end: input.selectionEnd})
    // Measure lazily: Floating UI re-reads this on ancestor resize and scroll.
    setAnchor({contextElement: input, getBoundingClientRect: () => measureCaret(input)})
  }

  function commit(label: string) {
    if (!match) return
    const replacement = slash ? '' : `${match.trigger}${label}${match.trigger === ':' ? ':' : ''} `
    const nextCaret = match.start + replacement.length
    pendingCaret.current = nextCaret
    setText(text.slice(0, match.start) + replacement + text.slice(match.end))
    setSelection({start: nextCaret, end: nextCaret})
    setDismissed(true)
    if (slash) setCommand(label)
  }

  React.useLayoutEffect(() => {
    if (pendingCaret.current !== null) {
      inputRef.current?.setSelectionRange(pendingCaret.current, pendingCaret.current)
      pendingCaret.current = null
    }
  }, [text])

  function onKeyDown(event: KeyEvent) {
    if (event.nativeEvent.isComposing || composing || event.keyCode === 229) {
      event.preventBaseUIHandler?.()
      return
    }
    if (event.key === 'Home' || event.key === 'End' || (event.key === 'Escape' && !open)) {
      event.preventBaseUIHandler?.()
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') setDismissed(true)
    if (event.key === 'Tab' && !event.shiftKey && open && highlighted) {
      event.preventDefault()
      event.preventBaseUIHandler?.()
      event.stopPropagation()
      commit(highlighted.label)
    }
  }

  return {
    anchor,
    command,
    id,
    inputProps: {
      ref: inputRef,
      'aria-label': slash ? 'Command editor' : 'Comment editor',
      onClick: (event: React.MouseEvent<HTMLTextAreaElement>) => {
        refresh(event.currentTarget)
        setDismissed(false)
      },
      onSelect: (event: React.SyntheticEvent<HTMLTextAreaElement>) => refresh(event.currentTarget),
      onScroll: (event: React.UIEvent<HTMLTextAreaElement>) => refresh(event.currentTarget),
      onCompositionStart: () => setComposing(true),
      onCompositionEnd: (event: React.CompositionEvent<HTMLTextAreaElement>) => {
        setComposing(false)
        refresh(event.currentTarget)
      },
    },
    onKeyDown,
    rootProps: {
      items,
      value: text,
      open,
      filter: null,
      autoHighlight: 'always' as const,
      itemToStringValue: (item: Suggestion) => item.label,
      onItemHighlighted: (item: Suggestion | undefined) => setHighlighted(item),
      onOpenChange: (next: boolean) => {
        if (!next) setDismissed(true)
      },
      onValueChange: (value: string, details: {reason: string}) => {
        if (details.reason === 'item-press') {
          commit(value)
        } else if (details.reason === 'input-change') {
          setText(value)
          setDismissed(false)
          if (inputRef.current) refresh(inputRef.current)
        }
      },
    },
  }
}
