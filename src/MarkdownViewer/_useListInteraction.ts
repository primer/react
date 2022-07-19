import {useCallback, useEffect, useMemo, useRef} from 'react'

/**
 * Groups:
 *  0. Leading whitespace
 *  1. Delimeter
 *  2. Item number (optional)
 *     - Note that we don't have item letter - we don't do autocomplete for lettered lists like (a, b, c) or (i, ii, iii) because it's too complex
 *  3. Task box (optional)
 *  4. Everything following
 */
const listItemRegex = /^(\s*)([*-]|(\d+)\.)\s(?:(\[[\sx]\])\s)?(.*)/i

type ListItem = {
  leadingWhitespace: string
  text: string
  delimeter: '-' | '*' | number
  taskBox: '[ ]' | '[x]' | null
}

type TaskListItem = ListItem & {taskBox: '[ ]' | '[x]'}

const parseListItem = (line: string): ListItem | null => {
  const result = listItemRegex.exec(line)
  if (!result) return null
  const [, leadingWhitespace = '', fullDelimeter, itemNumberStr = '', taskBox = null, text] = result
  const itemNumber = Number.parseInt(itemNumberStr, 10)
  const delimeter = Number.isNaN(itemNumber) ? (fullDelimeter as '*' | '-') : itemNumber

  return {
    leadingWhitespace,
    text,
    delimeter,
    taskBox: taskBox as '[ ]' | '[x]' | null
  }
}

const isTaskListItem = (item: ListItem | null): item is TaskListItem => typeof item?.taskBox === 'string'

const listItemToString = (item: ListItem) =>
  `${item.leadingWhitespace}${typeof item.delimeter === 'number' ? `${item.delimeter}.` : item.delimeter}${
    item.taskBox ? ` ${item.taskBox}` : ''
  } ${item.text}`

const toggleTaskListItem = (item: TaskListItem): TaskListItem => ({
  ...item,
  taskBox: item.taskBox === '[ ]' ? '[x]' : '[ ]'
})

type UseListInteractionSettings = {
  htmlContainer: HTMLDivElement | null
  markdownValue: string
  onChange: (markdown: string) => void | Promise<void>
  disabled?: boolean
}

/**
 * Adds support for list interaction to rendered Markdown.
 *
 * Currently only supports checking / unchecking list items - reordering and task-item to
 * issue conversion are not supported yet.
 */
export const useListInteraction = ({
  htmlContainer,
  markdownValue,
  onChange,
  disabled = false
}: UseListInteractionSettings) => {
  // Storing the value in a ref allows not using the markdown value as a depdency of
  // onToggleItem, which would mean we'd have to re-bind the event handlers on every change
  const markdownRef = useRef(markdownValue)
  markdownRef.current = markdownValue

  const onToggleItem = useCallback(
    (toggledItemIndex: number) => () => {
      const lines = markdownRef.current.split('\n')

      for (let lineIndex = 0, taskIndex = 0; lineIndex < lines.length; lineIndex++) {
        const parsedLine = parseListItem(lines[lineIndex])

        if (!isTaskListItem(parsedLine)) continue

        if (taskIndex === toggledItemIndex) {
          const updatedLine = listItemToString(toggleTaskListItem(parsedLine))
          lines.splice(lineIndex, 1, updatedLine)
          onChange(lines.join('\n'))
          return
        }

        taskIndex++
      }
    },
    [onChange]
  )

  const checkboxElements = useMemo(
    () =>
      Array.from(
        htmlContainer?.querySelectorAll<HTMLInputElement>('input[type=checkbox].task-list-item-checkbox') ?? []
      ),
    [htmlContainer]
  )

  // This could be combined with the other effect, but then the checkboxes might have a flicker
  // of being disabled between cleanup & setup
  useEffect(
    function enableOrDisableCheckboxes() {
      const cleanupFns = checkboxElements.map(el => {
        const previouslyDisabled = el.disabled
        el.disabled = disabled

        return () => {
          el.disabled = previouslyDisabled
        }
      })

      // eslint-disable-next-line github/array-foreach
      return () => cleanupFns.forEach(fn => fn())
    },
    [checkboxElements, disabled]
  )

  useEffect(
    function bindEventListeners() {
      const cleanupFns = checkboxElements.map((el, i) => {
        const toggleHandler = onToggleItem(i)
        el.addEventListener('change', toggleHandler)

        return () => el.removeEventListener('change', toggleHandler)
      })

      // eslint-disable-next-line github/array-foreach
      return () => cleanupFns.forEach(fn => fn())
    },
    [checkboxElements, onToggleItem]
  )
}
