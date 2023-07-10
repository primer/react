import {useCallback, useEffect, useRef, useState} from 'react'
import useIsomorphicLayoutEffect from '../../utils/useIsomorphicLayoutEffect'
import {ListItem, listItemToString, parseListItem} from '../MarkdownEditor/_useListEditing'

type TaskListItem = ListItem & {taskBox: '[ ]' | '[x]'}

// Make check for code fences more robust per spec: https://github.github.com/gfm/#fenced-code-blocks
const parseCodeFenceBegin = (line: string) => {
  const match = line.match(/^ {0,3}(`{3,}|~{3,})[^`]*$/)
  return match ? match[1] : null
}

const isCodeFenceEnd = (line: string, fence: string) => {
  const regex = new RegExp(`^ {0,3}${fence}${fence[0]}* *$`)
  return regex.test(line)
}

const isTaskListItem = (item: ListItem | null): item is TaskListItem => typeof item?.taskBox === 'string'

const toggleTaskListItem = (item: TaskListItem): TaskListItem => ({
  ...item,
  taskBox: item.taskBox === '[ ]' ? '[x]' : '[ ]',
})

type UseListInteractionSettings = {
  htmlContainer?: HTMLElement
  markdownValue: string
  onChange: (markdown: string) => void | Promise<void>
  disabled?: boolean
  dependencies?: Array<unknown>
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
  disabled = false,
  dependencies = [],
}: UseListInteractionSettings) => {
  // Storing the value in a ref allows not using the markdown value as a depdency of
  // onToggleItem, which would mean we'd have to re-bind the event handlers on every change
  const markdownRef = useRef(markdownValue)

  useIsomorphicLayoutEffect(() => {
    markdownRef.current = markdownValue
  }, [markdownValue])

  const onToggleItem = useCallback(
    (toggledItemIndex: number) => () => {
      const lines = markdownRef.current.split('\n')
      let currentCodeFence: string | null = null

      for (let lineIndex = 0, taskIndex = 0; lineIndex < lines.length; lineIndex++) {
        const line = lines[lineIndex]

        if (!currentCodeFence) {
          currentCodeFence = parseCodeFenceBegin(line)
        } else if (isCodeFenceEnd(line, currentCodeFence)) {
          currentCodeFence = null
          continue
        }

        if (currentCodeFence) continue

        const parsedLine = parseListItem(line)

        if (!isTaskListItem(parsedLine)) continue

        if (taskIndex === toggledItemIndex) {
          const updatedLine = listItemToString(toggleTaskListItem(parsedLine))
          lines.splice(lineIndex, 1, updatedLine)

          const updatedMarkdown = lines.join('\n')
          markdownRef.current = updatedMarkdown

          onChange(updatedMarkdown)
          return
        }

        taskIndex++
      }
    },
    [onChange],
  )

  const [checkboxElements, setCheckboxElements] = useState<HTMLInputElement[]>([])

  useEffect(
    () => {
      setCheckboxElements(
        Array.from(
          htmlContainer?.querySelectorAll<HTMLInputElement>('input[type=checkbox].task-list-item-checkbox') ?? [],
        ),
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [htmlContainer, ...dependencies],
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
    [checkboxElements, disabled],
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
    [checkboxElements, onToggleItem],
  )
}
