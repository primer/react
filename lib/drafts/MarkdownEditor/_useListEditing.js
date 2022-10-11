'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var utils = require('./utils.js');

const calculateNextListItemStarter = ({
  leadingWhitespace = '',
  delimeter,
  taskBox,
  text
}) => {
  if (!text) return null; // Delete the current list item if the user presses enter without typing anything

  const updatedDelimeter = typeof delimeter === 'number' ? `${delimeter + 1}.` : delimeter;
  const maybeEmptyTaskBox = taskBox ? ' [ ]' : '';
  return `\n${leadingWhitespace}${updatedDelimeter}${maybeEmptyTaskBox} `;
};
/**
 * Adapted from: https://github.com/github/github/blob/ef649172de6802a699638e22798396ca78d61dc8/app/assets/modules/github/behaviors/task-list.ts#L404
 *
 * Groups:
 *  0. Leading whitespace
 *  1. Delimeter
 *  2. Item number (optional)
 *     - Note that we don't have item letter - we don't do autocomplete for lettered lists like (a, b, c) or (i, ii, iii) because it's too complex
 *  3. Task box (optional)
 *  4. Everything following
 */


const listItemRegex = /^(\s*)([*-]|(\d+)\.)\s(?:(\[[\sx]\])\s)?(.*)/i;

const isNumericListItem = item => typeof (item === null || item === void 0 ? void 0 : item.delimeter) === 'number';

const parseListItem = line => {
  const result = listItemRegex.exec(line);
  if (!result) return null;
  const [, leadingWhitespace = '', fullDelimeter, itemNumberStr = '', taskBox = null, text] = result;
  const itemNumber = Number.parseInt(itemNumberStr, 10);
  const delimeter = Number.isNaN(itemNumber) ? fullDelimeter : itemNumber;
  return {
    leadingWhitespace,
    text,
    delimeter,
    taskBox: taskBox
  };
};
const listItemToString = item => `${item.leadingWhitespace}${typeof item.delimeter === 'number' ? `${item.delimeter}.` : item.delimeter}${item.taskBox ? ` ${item.taskBox}` : ''} ${item.text}`;
/**
 * Provides support for list editing in the Markdown editor. This includes inserting new
 * list items and auto-incrementing numeric lists.
 */

const useListEditing = ({
  emitChange
}) => {
  const incrementFollowingNumericLines = React.useCallback(textarea => {
    // this must be recalculated instead of passed because we are on a new line now
    const [currentLineStart, currentLineEnd] = utils.getSelectedLineRange(textarea);
    const currentLineText = textarea.value.slice(currentLineStart, currentLineEnd);
    const currentLineItem = parseListItem(currentLineText);
    if (!isNumericListItem(currentLineItem)) return; // Strip off the leading newline by adding 1

    const followingText = textarea.value.slice(currentLineEnd + 1);
    const followingLines = followingText.split('\n');
    const followingNumericListItems = [];
    let prevItemNumber = currentLineItem.delimeter;

    for (const line of followingLines) {
      const listItem = parseListItem(line);
      if (!isNumericListItem(listItem) || listItem.delimeter !== prevItemNumber) break;
      followingNumericListItems.push(listItem);
      prevItemNumber++;
    }

    if (followingNumericListItems.length === 0) return; // don't forget to re-add the leading newline stripped off earlier

    const updatedItems = `\n${followingNumericListItems.map(item => listItemToString({ ...item,
      delimeter: item.delimeter + 1
    })).join('\n')}`;
    emitChange(updatedItems, [currentLineEnd, currentLineEnd + updatedItems.length + 1], textarea.selectionStart);
  }, [emitChange]);
  const onKeyDown = React.useCallback(event => {
    if (event.key === 'Enter' && !event.shiftKey && !event.defaultPrevented) {
      const textarea = event.currentTarget;
      const [activeLineStart, activeLineEnd] = utils.getSelectedLineRange(textarea); // current line text without any of the selected text

      const activeLineValue = textarea.value.slice(activeLineStart, textarea.selectionStart) + textarea.value.slice(textarea.selectionEnd, activeLineEnd);
      const listItem = parseListItem(activeLineValue);
      if (!listItem) return; // not currently editing a list - let the browser handle the event

      event.preventDefault();
      const nextItemStarter = calculateNextListItemStarter(listItem);

      if (nextItemStarter === null) {
        emitChange('', [activeLineStart, textarea.selectionEnd]);
      } else {
        emitChange(nextItemStarter); // increment following lines as a separate event so the user can separately undo the change

        incrementFollowingNumericLines(textarea);
      }
    }
  }, [emitChange, incrementFollowingNumericLines]);
  return {
    onKeyDown
  };
};

exports.listItemRegex = listItemRegex;
exports.listItemToString = listItemToString;
exports.parseListItem = parseListItem;
exports.useListEditing = useListEditing;
