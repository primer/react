import {useCallback, useMemo} from 'react'
import {SyntheticChangeEmitter} from '../hooks'
import {getSelectedLineRange, InputState, isMultipleLines} from './utils'

export type FormattingTools = {
  heading: (level: number) => void
  bold: () => void
  italic: () => void
  quote: () => void
  code: () => void
  link: (url?: string) => void
  image: (url?: string) => void
  unorderedList: () => void
  orderedList: () => void
  taskList: () => void
  mention: () => void
  reference: () => void
}

type StyleArgs = {
  prefix: string
  suffix: string
  blockPrefix: string
  blockSuffix: string
  multiline: boolean
  replaceNext: string
  prefixSpace: boolean
  scanFor: string
  surroundWithNewlines: boolean
  orderedList: boolean
  unorderedList: boolean
  trimFirst: boolean
}
type PartialStyleArgs = Partial<StyleArgs>

const defaultArgs: StyleArgs = {
  prefix: '',
  suffix: '',
  blockPrefix: '',
  blockSuffix: '',
  multiline: false,
  replaceNext: '',
  prefixSpace: false,
  scanFor: '',
  surroundWithNewlines: false,
  orderedList: false,
  unorderedList: false,
  trimFirst: false
}

type Change = {
  value: string
  /** If not provided, will replace the current selection. */
  replaceRange?: [number, number]
  selectionRange: [number, number]
}

const headingStyle = (level: number): PartialStyleArgs => ({prefix: `${'#'.repeat(level)} `})

const boldStyle: PartialStyleArgs = {prefix: '**', suffix: '**', trimFirst: true}

const italicStyle: PartialStyleArgs = {prefix: '_', suffix: '_', trimFirst: true}

const quoteStyle: PartialStyleArgs = {prefix: '> ', multiline: true, surroundWithNewlines: true}

const codeStyle: PartialStyleArgs = {prefix: '`', suffix: '`', blockPrefix: '```', blockSuffix: '```'}

const linkStyle = (url?: string) =>
  url === undefined
    ? {prefix: '[', suffix: '](url)', replaceNext: 'url', scanFor: 'https?://'}
    : {prefix: '[', suffix: `](${url})`}

const imageStyle = (url?: string) =>
  url === undefined
    ? {prefix: '![', suffix: '](url)', replaceNext: 'url', scanFor: 'https?://'}
    : {prefix: '![', suffix: `](${url})`}

const unorderedListStyle: PartialStyleArgs = {prefix: '- ', multiline: true, unorderedList: true}

const orderedListStyle: PartialStyleArgs = {prefix: '1. ', multiline: true, orderedList: true}

const taskListStyle: PartialStyleArgs = {prefix: '- [ ] ', multiline: true, unorderedList: true}

const mentionStyle: PartialStyleArgs = {prefix: '@', prefixSpace: true}

const referenceStyle: PartialStyleArgs = {prefix: '#', prefixSpace: true}

function getWordSelectionStart(text: string, i: number): number {
  let index = i
  while (text.at(index) && text.at(index - 1) && !text[index - 1].match(/\s/)) {
    index--
  }
  return index
}

function getWordSelectionEnd(text: string, i: number, multiline: boolean): number {
  let index = i
  const breakpoint = multiline ? /\n/ : /\s/
  while (text.at(index) && !text[index].match(breakpoint)) {
    index++
  }
  return index
}

function expandSelectionToLine(inputState: InputState): InputState {
  const [selectionStart, selectionEnd] = getSelectedLineRange(inputState)
  return {...inputState, selectionStart, selectionEnd}
}

function expandSelectedText(
  textarea: InputState,
  prefixToUse: string,
  suffixToUse: string,
  multiline = false
): InputState {
  let {selectionStart, selectionEnd} = textarea
  if (selectionStart === selectionEnd) {
    selectionStart = getWordSelectionStart(textarea.value, selectionStart)
    selectionEnd = getWordSelectionEnd(textarea.value, selectionEnd, multiline)
  } else {
    const expandedSelectionStart = selectionStart - prefixToUse.length
    const expandedSelectionEnd = selectionEnd + suffixToUse.length
    const beginsWithPrefix = textarea.value.slice(expandedSelectionStart, selectionStart) === prefixToUse
    const endsWithSuffix = textarea.value.slice(selectionEnd, expandedSelectionEnd) === suffixToUse
    if (beginsWithPrefix && endsWithSuffix) {
      selectionStart = expandedSelectionStart
      selectionEnd = expandedSelectionEnd
    }
  }
  return {...textarea, selectionStart, selectionEnd}
}

interface Newlines {
  newlinesToAppend: string
  newlinesToPrepend: string
}

function newlinesToSurroundSelectedText(textarea: InputState): Newlines {
  const beforeSelection = textarea.value.slice(0, textarea.selectionStart)
  const afterSelection = textarea.value.slice(textarea.selectionEnd)

  const breaksBefore = beforeSelection.match(/\n*$/)
  const breaksAfter = afterSelection.match(/^\n*/)
  const newlinesBeforeSelection = breaksBefore ? breaksBefore[0].length : 0
  const newlinesAfterSelection = breaksAfter ? breaksAfter[0].length : 0

  let newlinesToAppend
  let newlinesToPrepend

  if (beforeSelection.match(/\S/) && newlinesBeforeSelection < 2) {
    newlinesToAppend = '\n'.repeat(2 - newlinesBeforeSelection)
  }

  if (afterSelection.match(/\S/) && newlinesAfterSelection < 2) {
    newlinesToPrepend = '\n'.repeat(2 - newlinesAfterSelection)
  }

  if (newlinesToAppend == null) {
    newlinesToAppend = ''
  }

  if (newlinesToPrepend == null) {
    newlinesToPrepend = ''
  }

  return {newlinesToAppend, newlinesToPrepend}
}

function blockStyle(initialState: InputState, arg: StyleArgs): Change {
  let newlinesToAppend
  let newlinesToPrepend

  const {prefix, suffix, blockPrefix, blockSuffix, replaceNext, prefixSpace, scanFor, surroundWithNewlines} = arg
  const originalSelectionStart = initialState.selectionStart
  const originalSelectionEnd = initialState.selectionEnd

  let selectedText = initialState.value.slice(initialState.selectionStart, initialState.selectionEnd)
  let prefixToUse = isMultipleLines(selectedText) && blockPrefix.length > 0 ? `${blockPrefix}\n` : prefix
  let suffixToUse = isMultipleLines(selectedText) && blockSuffix.length > 0 ? `\n${blockSuffix}` : suffix

  if (prefixSpace) {
    const beforeSelection = initialState.value[initialState.selectionStart - 1] as string | undefined
    if (initialState.selectionStart !== 0 && beforeSelection !== undefined && !beforeSelection.match(/\s/)) {
      prefixToUse = ` ${prefixToUse}`
    }
  }
  const expandedSelectionState = expandSelectedText(initialState, prefixToUse, suffixToUse, arg.multiline)
  selectedText = expandedSelectionState.value.slice(
    expandedSelectionState.selectionStart,
    expandedSelectionState.selectionEnd
  )
  let selectionStart = expandedSelectionState.selectionStart
  let selectionEnd = expandedSelectionState.selectionEnd
  const hasReplaceNext = replaceNext.length > 0 && suffixToUse.indexOf(replaceNext) > -1 && selectedText.length > 0
  if (surroundWithNewlines) {
    const ref = newlinesToSurroundSelectedText(expandedSelectionState)
    newlinesToAppend = ref.newlinesToAppend
    newlinesToPrepend = ref.newlinesToPrepend
    prefixToUse = newlinesToAppend + prefix
    suffixToUse += newlinesToPrepend
  }

  let replacementText
  if (selectedText.startsWith(prefixToUse) && selectedText.endsWith(suffixToUse)) {
    replacementText = selectedText.slice(prefixToUse.length, selectedText.length - suffixToUse.length)
    if (originalSelectionStart === originalSelectionEnd) {
      let position = originalSelectionStart - prefixToUse.length
      position = Math.max(position, selectionStart)
      position = Math.min(position, selectionStart + replacementText.length)
      selectionStart = selectionEnd = position
    } else {
      selectionEnd = selectionStart + replacementText.length
    }
  } else if (!hasReplaceNext) {
    replacementText = prefixToUse + selectedText + suffixToUse
    selectionStart = originalSelectionStart + prefixToUse.length
    selectionEnd = originalSelectionEnd + prefixToUse.length
    const whitespaceEdges = selectedText.match(/^\s*|\s*$/g)
    if (arg.trimFirst && whitespaceEdges) {
      const leadingWhitespace = whitespaceEdges[0] || ''
      const trailingWhitespace = whitespaceEdges[1] || ''
      replacementText = leadingWhitespace + prefixToUse + selectedText.trim() + suffixToUse + trailingWhitespace
      selectionStart += leadingWhitespace.length
      selectionEnd -= trailingWhitespace.length
    }
  } else if (scanFor.length > 0 && selectedText.match(scanFor)) {
    suffixToUse = suffixToUse.replace(replaceNext, selectedText)
    replacementText = prefixToUse + suffixToUse
    selectionStart = selectionEnd = selectionStart + prefixToUse.length
  } else {
    replacementText = prefixToUse + selectedText + suffixToUse
    selectionStart = selectionStart + prefixToUse.length + selectedText.length + suffixToUse.indexOf(replaceNext)
    selectionEnd = selectionStart + replaceNext.length
  }

  return {
    value: replacementText,
    replaceRange: [expandedSelectionState.selectionStart, expandedSelectionState.selectionEnd],
    selectionRange: [selectionStart, selectionEnd]
  }
}

function multilineStyle(inputState: InputState, arg: StyleArgs): Change {
  const {prefix, suffix, surroundWithNewlines} = arg
  let text = inputState.value.slice(inputState.selectionStart, inputState.selectionEnd)
  let selectionStart = inputState.selectionStart
  let selectionEnd = inputState.selectionEnd
  const lines = text.split('\n')
  const undoStyle = lines.every(line => line.startsWith(prefix) && line.endsWith(suffix))

  if (undoStyle) {
    text = lines.map(line => line.slice(prefix.length, line.length - suffix.length)).join('\n')
    selectionEnd = selectionStart + text.length
  } else {
    text = lines.map(line => prefix + line + suffix).join('\n')
    if (surroundWithNewlines) {
      const {newlinesToAppend, newlinesToPrepend} = newlinesToSurroundSelectedText(inputState)
      selectionStart += newlinesToAppend.length
      selectionEnd = selectionStart + text.length
      text = newlinesToAppend + text + newlinesToPrepend
    }
  }

  return {
    value: text,
    selectionRange: [selectionStart, selectionEnd]
  }
}

interface UndoResult {
  text: string
  processed: boolean
}
function undoOrderedListStyle(text: string): UndoResult {
  const lines = text.split('\n')
  const orderedListRegex = /^\d+\.\s+/
  const shouldUndoOrderedList = lines.every(line => orderedListRegex.test(line))
  let result = lines
  if (shouldUndoOrderedList) {
    result = lines.map(line => line.replace(orderedListRegex, ''))
  }

  return {
    text: result.join('\n'),
    processed: shouldUndoOrderedList
  }
}

function undoUnorderedListStyle(text: string): UndoResult {
  const lines = text.split('\n')
  const unorderedListPrefix = '- '
  const shouldUndoUnorderedList = lines.every(line => line.startsWith(unorderedListPrefix))
  let result = lines
  if (shouldUndoUnorderedList) {
    result = lines.map(line => line.slice(unorderedListPrefix.length, line.length))
  }

  return {
    text: result.join('\n'),
    processed: shouldUndoUnorderedList
  }
}

function makePrefix(index: number, unorderedList: boolean): string {
  if (unorderedList) {
    return '- '
  } else {
    return `${index + 1}. `
  }
}

function clearExistingListStyle(style: StyleArgs, selectedText: string): [UndoResult, UndoResult, string] {
  let undoResultOpositeList: UndoResult
  let undoResult: UndoResult
  let pristineText
  if (style.orderedList) {
    undoResult = undoOrderedListStyle(selectedText)
    undoResultOpositeList = undoUnorderedListStyle(undoResult.text)
    pristineText = undoResultOpositeList.text
  } else {
    undoResult = undoUnorderedListStyle(selectedText)
    undoResultOpositeList = undoOrderedListStyle(undoResult.text)
    pristineText = undoResultOpositeList.text
  }
  return [undoResult, undoResultOpositeList, pristineText]
}

function listStyle(initialState: InputState, style: StyleArgs): Change {
  const noInitialSelection = initialState.selectionStart === initialState.selectionEnd
  let selectionStart = initialState.selectionStart
  let selectionEnd = initialState.selectionEnd

  // Select whole line
  const expandedSelectionState = expandSelectionToLine(initialState)
  const replaceRange: [number, number] = [expandedSelectionState.selectionStart, expandedSelectionState.selectionEnd]

  const selectedText = expandedSelectionState.value.slice(
    expandedSelectionState.selectionStart,
    expandedSelectionState.selectionEnd
  )

  // If the user intent was to do an undo, we will stop after this.
  // Otherwise, we will still undo to other list type to prevent list stacking
  const [undoResult, undoResultOpositeList, pristineText] = clearExistingListStyle(style, selectedText)

  const prefixedLines = pristineText.split('\n').map((value, index) => {
    return `${makePrefix(index, style.unorderedList)}${value}`
  })

  const totalPrefixLength = prefixedLines.reduce((previousValue, _currentValue, currentIndex) => {
    return previousValue + makePrefix(currentIndex, style.unorderedList).length
  }, 0)

  const totalPrefixLengthOpositeList = prefixedLines.reduce((previousValue, _currentValue, currentIndex) => {
    return previousValue + makePrefix(currentIndex, !style.unorderedList).length
  }, 0)

  if (undoResult.processed) {
    if (noInitialSelection) {
      selectionStart = Math.max(selectionStart - makePrefix(0, style.unorderedList).length, 0)
      selectionEnd = selectionStart
    } else {
      selectionStart = expandedSelectionState.selectionStart
      selectionEnd = expandedSelectionState.selectionEnd - totalPrefixLength
    }
    return {value: pristineText, replaceRange, selectionRange: [selectionStart, selectionEnd]}
  }

  const {newlinesToAppend, newlinesToPrepend} = newlinesToSurroundSelectedText(expandedSelectionState)
  const text = newlinesToAppend + prefixedLines.join('\n') + newlinesToPrepend

  if (noInitialSelection) {
    selectionStart = Math.max(selectionStart + makePrefix(0, style.unorderedList).length + newlinesToAppend.length, 0)
    selectionEnd = selectionStart
  } else {
    if (undoResultOpositeList.processed) {
      selectionStart = Math.max(expandedSelectionState.selectionStart + newlinesToAppend.length, 0)
      selectionEnd =
        expandedSelectionState.selectionEnd + newlinesToAppend.length + totalPrefixLength - totalPrefixLengthOpositeList
    } else {
      selectionStart = Math.max(expandedSelectionState.selectionStart + newlinesToAppend.length, 0)
      selectionEnd = expandedSelectionState.selectionEnd + newlinesToAppend.length + totalPrefixLength
    }
  }

  return {value: text, replaceRange, selectionRange: [selectionStart, selectionEnd]}
}

export const useFormattingTools = (
  textareaRef: React.RefObject<InputState>,
  emitChange: SyntheticChangeEmitter
): FormattingTools => {
  const styleSelectedText = useCallback(
    (style: PartialStyleArgs) => {
      if (!textareaRef.current) return
      const currentState = {
        value: textareaRef.current.value,
        selectionStart: textareaRef.current.selectionStart,
        selectionEnd: textareaRef.current.selectionEnd
      }

      const styleArgs = {...defaultArgs, ...style}
      const text = currentState.value.slice(currentState.selectionStart, currentState.selectionEnd)

      let result
      if (styleArgs.orderedList || styleArgs.unorderedList) {
        result = listStyle(currentState, styleArgs)
      } else if (styleArgs.multiline && isMultipleLines(text)) {
        result = multilineStyle(currentState, styleArgs)
      } else {
        result = blockStyle(currentState, styleArgs)
      }

      emitChange(result.value, result.replaceRange, result.selectionRange)
    },
    [textareaRef, emitChange]
  )

  const heading = useCallback((lever: number) => styleSelectedText(headingStyle(lever)), [styleSelectedText])
  const bold = useCallback(() => styleSelectedText(boldStyle), [styleSelectedText])
  const italic = useCallback(() => styleSelectedText(italicStyle), [styleSelectedText])
  const quote = useCallback(() => styleSelectedText(quoteStyle), [styleSelectedText])
  const code = useCallback(() => styleSelectedText(codeStyle), [styleSelectedText])
  const link = useCallback((url?: string) => styleSelectedText(linkStyle(url)), [styleSelectedText])
  const image = useCallback((url?: string) => styleSelectedText(imageStyle(url)), [styleSelectedText])
  const unorderedList = useCallback(() => styleSelectedText(unorderedListStyle), [styleSelectedText])
  const orderedList = useCallback(() => styleSelectedText(orderedListStyle), [styleSelectedText])
  const taskList = useCallback(() => styleSelectedText(taskListStyle), [styleSelectedText])
  const mention = useCallback(() => styleSelectedText(mentionStyle), [styleSelectedText])
  const reference = useCallback(() => styleSelectedText(referenceStyle), [styleSelectedText])

  return useMemo(
    () => ({
      heading,
      bold,
      italic,
      quote,
      code,
      link,
      image,
      unorderedList,
      orderedList,
      taskList,
      mention,
      reference
    }),
    [heading, bold, italic, quote, code, link, image, unorderedList, orderedList, taskList, mention, reference]
  )
}
