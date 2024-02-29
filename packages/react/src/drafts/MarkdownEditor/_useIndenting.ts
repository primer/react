import {useCallback} from 'react'
import type {SyntheticChangeEmitter} from '../hooks/useSyntheticChange'

import {getSelectedLineRange} from './utils'

type UseIndentingSettings = {
  emitChange: SyntheticChangeEmitter
}

type UseIndentingResult = {
  onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement>
}

const indentationRegex = /^(?:\t| ? ?)(.*)/

const dedent = (line: string) => indentationRegex.exec(line)?.[1] ?? ''
const indent = (line: string) => `  ${line}`

/**
 * Provides functionality for indenting and dedenting selected lines in the Markdown editor.
 */
export const useIndenting = ({emitChange}: UseIndentingSettings): UseIndentingResult => {
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const textarea = event.currentTarget
      if (event.defaultPrevented || event.key !== 'Tab' || textarea.selectionEnd - textarea.selectionStart === 0) return
      event.preventDefault()

      const [start, end] = getSelectedLineRange(textarea)
      const updatedLines = textarea.value
        .slice(start, end)
        .split(/\r?\n/)
        .map(line => (event.shiftKey ? dedent(line) : indent(line)))
        .join('\n')

      emitChange(updatedLines, [start, end], [start, start + updatedLines.length])
    },
    [emitChange],
  )

  return {onKeyDown}
}
