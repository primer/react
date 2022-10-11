import { useCallback } from 'react';
import { getSelectedLineRange } from './utils.js';

const indentationRegex = /^(?:\t| ? ?)(.*)/;

const dedent = line => {
  var _indentationRegex$exe, _indentationRegex$exe2;

  return (_indentationRegex$exe = (_indentationRegex$exe2 = indentationRegex.exec(line)) === null || _indentationRegex$exe2 === void 0 ? void 0 : _indentationRegex$exe2[1]) !== null && _indentationRegex$exe !== void 0 ? _indentationRegex$exe : '';
};

const indent = line => `  ${line}`;
/**
 * Provides functionality for indenting and dedenting selected lines in the Markdown editor.
 */


const useIndenting = ({
  emitChange
}) => {
  const onKeyDown = useCallback(event => {
    const textarea = event.currentTarget;
    if (event.defaultPrevented || event.key !== 'Tab' || textarea.selectionEnd - textarea.selectionStart === 0) return;
    event.preventDefault();
    const [start, end] = getSelectedLineRange(textarea);
    const updatedLines = textarea.value.slice(start, end).split('\n').map(line => event.shiftKey ? dedent(line) : indent(line)).join('\n');
    emitChange(updatedLines, [start, end], [start, start + updatedLines.length]);
  }, [emitChange]);
  return {
    onKeyDown
  };
};

export { useIndenting };
