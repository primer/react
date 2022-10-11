'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

const calculateNewCaretPosition = (originalCaretPosition, replaceRange, insertLength) => {
  const deleteLength = replaceRange[1] - replaceRange[0];
  const lengthDifference = insertLength - deleteLength; // If caret is before the replacement, position is unaffected. If it is at/in the replacement
  // section, move it to the end (as though the user had selected text and typed
  // the replacement). If it is after the replacement, move it by the length difference.

  return originalCaretPosition < replaceRange[0] ? originalCaretPosition : originalCaretPosition < replaceRange[1] ? replaceRange[0] + insertLength : originalCaretPosition + lengthDifference;
};
/**
 * Builds a fake `React.ChangeEvent` from a dispatched `InputEvent` instance.
 * This is only used as a fallback in cases where browsers don't support `execCommand`.
 */


const SyntheticChangeEvent = (dispatchedEvent, target) => ({ // Spreading the event is particularly imperfect. Functions called on the `SyntheticEvent`
  // will have the wrong `this` binding and shallow object properties may fall out of sync.
  // We consider this acceptable since this is only the fallback behavior, but it's not ideal by any means.
  ...dispatchedEvent,
  nativeEvent: dispatchedEvent,
  target,
  // `currentTarget` is the element that the event listener is attached to. The event
  // doesn't know this, so `event.currentTarget` is `null`.
  currentTarget: target,
  preventDefault: () => dispatchedEvent.preventDefault(),
  isDefaultPrevented: () => dispatchedEvent.defaultPrevented,
  // This event doesn't bubble anyway so there's no need for the consumer to try to
  // stop propagation
  isPropagationStopped: () => false,
  // "As of v17, e.persist() doesn’t do anything because the SyntheticEvent is no
  // longer pooled" -  https://reactjs.org/docs/events.html#overview
  persist: () => ({
    /* noop */
  })
});

/**
 * Returns a function that will synthetically change the input, attempting to maintain caret
 * position and undo history as though the user had typed using a keyboard.
 *
 * Will first attempt to use the non-standard browser `execCommmand` API to simulate a typing
 * action. Failing this (ie, in test environments or certain browsers), the fallback handler
 * will be called with a fake constructed `ChangeEvent` that looks like a real event.
 */
const useSyntheticChange = ({
  inputRef,
  fallbackEventHandler
}) => React.useCallback((insertValue, replaceRange_, newSelection_) => {
  var _input$selectionStart, _input$selectionEnd, _input$selectionStart2;

  const input = inputRef.current;
  if (!input) return;
  input.focus(); // the input must be focused to execute execCommand

  const replaceRange = replaceRange_ !== null && replaceRange_ !== void 0 ? replaceRange_ : [(_input$selectionStart = input.selectionStart) !== null && _input$selectionStart !== void 0 ? _input$selectionStart : input.value.length, (_input$selectionEnd = input.selectionEnd) !== null && _input$selectionEnd !== void 0 ? _input$selectionEnd : input.value.length];
  const newSelectionStart = newSelection_ === undefined ? calculateNewCaretPosition((_input$selectionStart2 = input.selectionStart) !== null && _input$selectionStart2 !== void 0 ? _input$selectionStart2 : input.value.length, replaceRange, insertValue.length) : Array.isArray(newSelection_) ? newSelection_[0] : newSelection_;
  const newSelectionEnd = Array.isArray(newSelection_) ? newSelection_[1] : newSelectionStart; // execCommmand simulates the user actually typing the value into the input. This preserves the undo history,
  // but it's a deprecated API and there's no alternative. It also doesn't work in test environments

  let execCommandResult = false;

  try {
    // expand selection to the whole range and replace it with the new value
    input.setSelectionRange(replaceRange[0], replaceRange[1]);
    execCommandResult = insertValue === '' ? document.execCommand('delete', false) : document.execCommand('insertText', false, insertValue);
    input.setSelectionRange(newSelectionStart, newSelectionEnd);
  } catch (e) {
    execCommandResult = false;
  } // If the execCommand method failed, call onChange instead - will nuke the undo history :(


  if (!execCommandResult) {
    const newValue = input.value.slice(0, replaceRange[0]) + insertValue + input.value.slice(replaceRange[1]); // When building the event we could also define the inputType and data, but that would
    // be complex for the consumer to maintain. For now that's not functionality that is
    // strictly necessary.
    // React SyntheticChangeEvents are actually built around 'input' events, not 'change' events

    const event = new InputEvent('input', {
      bubbles: false
    });
    inputRef.current.value = newValue;
    inputRef.current.setSelectionRange(newSelectionStart, newSelectionEnd); // Even though we call onChange manually, we must dispatch the event so the browser can
    // set its `target` and fully create it

    inputRef.current.dispatchEvent(event); // Surprisingly, dispatching the event does not cause React to call handlers, even
    // though it looks almost exactly like a normal 'input' event. Maybe it's because the
    // event is not trusted? So we have to build and dispatch the `SyntheticEvent` ourselves.
    // This is not perfect but it gets pretty close.

    fallbackEventHandler(SyntheticChangeEvent(event, inputRef.current));
  }
}, [inputRef, fallbackEventHandler]);

exports.useSyntheticChange = useSyntheticChange;
