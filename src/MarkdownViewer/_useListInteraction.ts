import {useCallback, useEffect, useMemo, useRef} from 'react'
import {ListItem, listItemToString, parseListItem} from '../MarkdownEditor/_useListEditing'

type TaskListItem = ListItem & {taskBox: '[ ]' | '[x]'}

const isTaskListItem = (item: ListItem | null): item is TaskListItem => typeof item?.taskBox === 'string'

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
