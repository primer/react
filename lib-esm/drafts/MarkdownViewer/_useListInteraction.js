import { useRef, useLayoutEffect, useCallback, useMemo, useEffect } from 'react';
import { parseListItem, listItemToString } from '../MarkdownEditor/_useListEditing.js';

const isTaskListItem = item => typeof (item === null || item === void 0 ? void 0 : item.taskBox) === 'string';

const toggleTaskListItem = item => ({ ...item,
  taskBox: item.taskBox === '[ ]' ? '[x]' : '[ ]'
});

/**
 * Adds support for list interaction to rendered Markdown.
 *
 * Currently only supports checking / unchecking list items - reordering and task-item to
 * issue conversion are not supported yet.
 */
const useListInteraction = ({
  htmlContainer,
  markdownValue,
  onChange,
  disabled = false
}) => {
  // Storing the value in a ref allows not using the markdown value as a depdency of
  // onToggleItem, which would mean we'd have to re-bind the event handlers on every change
  const markdownRef = useRef(markdownValue);
  useLayoutEffect(() => {
    markdownRef.current = markdownValue;
  }, [markdownValue]);
  const onToggleItem = useCallback(toggledItemIndex => () => {
    const lines = markdownRef.current.split('\n');

    for (let lineIndex = 0, taskIndex = 0; lineIndex < lines.length; lineIndex++) {
      const parsedLine = parseListItem(lines[lineIndex]);
      if (!isTaskListItem(parsedLine)) continue;

      if (taskIndex === toggledItemIndex) {
        const updatedLine = listItemToString(toggleTaskListItem(parsedLine));
        lines.splice(lineIndex, 1, updatedLine);
        const updatedMarkdown = lines.join('\n');
        markdownRef.current = updatedMarkdown;
        onChange(updatedMarkdown);
        return;
      }

      taskIndex++;
    }
  }, [onChange]);
  const checkboxElements = useMemo(() => {
    var _htmlContainer$queryS;

    return Array.from((_htmlContainer$queryS = htmlContainer === null || htmlContainer === void 0 ? void 0 : htmlContainer.querySelectorAll('input[type=checkbox].task-list-item-checkbox')) !== null && _htmlContainer$queryS !== void 0 ? _htmlContainer$queryS : []);
  }, [htmlContainer]); // This could be combined with the other effect, but then the checkboxes might have a flicker
  // of being disabled between cleanup & setup

  useEffect(function enableOrDisableCheckboxes() {
    const cleanupFns = checkboxElements.map(el => {
      const previouslyDisabled = el.disabled;
      el.disabled = disabled;
      return () => {
        el.disabled = previouslyDisabled;
      };
    }); // eslint-disable-next-line github/array-foreach

    return () => cleanupFns.forEach(fn => fn());
  }, [checkboxElements, disabled]);
  useEffect(function bindEventListeners() {
    const cleanupFns = checkboxElements.map((el, i) => {
      const toggleHandler = onToggleItem(i);
      el.addEventListener('change', toggleHandler);
      return () => el.removeEventListener('change', toggleHandler);
    }); // eslint-disable-next-line github/array-foreach

    return () => cleanupFns.forEach(fn => fn());
  }, [checkboxElements, onToggleItem]);
};

export { useListInteraction };
