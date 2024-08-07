import {useCallback} from 'react'

const calculateNewCaretPosition = (
  originalCaretPosition: number,
  replaceRange: [number, number],
  insertLength: number,
): number => {
  const deleteLength = replaceRange[1] - replaceRange[0]
  const lengthDifference = insertLength - deleteLength

  // If caret is before the replacement, position is unaffected. If it is at/in the replacement
  // section, move it to the end (as though the user had selected text and typed
  // the replacement). If it is after the replacement, move it by the length difference.
  return originalCaretPosition < replaceRange[0]
    ? originalCaretPosition
    : originalCaretPosition < replaceRange[1]
    ? replaceRange[0] + insertLength
    : originalCaretPosition + lengthDifference
}

/**
 * Builds a fake `React.ChangeEvent` from a dispatched `InputEvent` instance.
 * This is only used as a fallback in cases where browsers don't support `execCommand`.
 */
const SyntheticChangeEvent = <Element extends HTMLElement>(
  dispatchedEvent: InputEvent,
  // Could use dispatchedEvent.target, but that would require a type assertion because InputEvent is not generic
  target: Element,
): React.ChangeEvent<Element> => ({
  // Spreading the event is particularly imperfect. Functions called on the `SyntheticEvent`
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
  }),
})

type UseSyntheticChangeSettings<
  Element extends HTMLTextAreaElement | HTMLInputElement = HTMLTextAreaElement | HTMLInputElement,
> = {
  /** Ref to the input element to change. */
  inputRef: React.RefObject<Element>
  /**
   * A callback that will be triggered when the normal method of faking a synthetic event
   * fails. This should be the same function as the input's `onChange` handler.
   *
   * The ideal behavior is to simulate change as though a user had typed the value, which in
   * turn will call any change event handlers on the input. That doesn't work in all browsers,
   * so the fallback behavior is to call this handler with a simulated event.
   */
  fallbackEventHandler: React.ChangeEventHandler<Element>
}

/**
 * A function that, when called, will simulate a synthetic change event on the bound input.
 * @param insertValue The value to insert.
 * @param replaceRange The range of text to replace. By default, text will be inserted
 * as though the user typed it, replacing any currently selected text.
 * @param newSelection Selection to apply after the change. By default, the caret will
 * be automatically adjusted based on the replaced text, moving it to the end of the inserted
 * text if it was inside the `replaceRange` before. Can be a single number for a caret location
 * or two numbers for a selection range.
 */
export type SyntheticChangeEmitter = (
  insertValue: string,
  replaceRange?: [startIndexInclusive: number, endIndexExclusive: number],
  newSelection?: number | [number, number],
) => void

/**
 * Returns a function that will synthetically change the input, attempting to maintain caret
 * position and undo history as though the user had typed using a keyboard.
 *
 * Will first attempt to use the non-standard browser `execCommmand` API to simulate a typing
 * action. Failing this (ie, in test environments or certain browsers), the fallback handler
 * will be called with a fake constructed `ChangeEvent` that looks like a real event.
 *
 * @deprecated Will be removed in v37 (https://github.com/primer/react/issues/3604)
 */
export const useSyntheticChange = ({inputRef, fallbackEventHandler}: UseSyntheticChangeSettings) =>
  useCallback<SyntheticChangeEmitter>(
    (insertValue, replaceRange_, newSelection_) => {
      const input = inputRef.current
      if (!input) return

      input.focus()

      const replaceRange = replaceRange_ ?? [
        input.selectionStart ?? input.value.length,
        input.selectionEnd ?? input.value.length,
      ]

      const newSelectionStart =
        newSelection_ === undefined
          ? calculateNewCaretPosition(input.selectionStart ?? input.value.length, replaceRange, insertValue.length)
          : Array.isArray(newSelection_)
          ? newSelection_[0]
          : newSelection_
      const newSelectionEnd = Array.isArray(newSelection_) ? newSelection_[1] : newSelectionStart

      // execCommmand simulates the user actually typing the value into the input. This preserves the undo history,
      // but it's a deprecated API and there's no alternative. It also doesn't work in test environments
      let execCommandResult = false
      try {
        // There is no guarantee the input is focused even after calling `focus()` on it. For example, the focus could
        // be trapped by an overlay. In that case we must prevent the change from happening in some unexpected target.
        if (document.activeElement !== input) throw new Error('Input must be focused to use execCommand')

        // expand selection to the whole range and replace it with the new value
        input.setSelectionRange(replaceRange[0], replaceRange[1])
        execCommandResult =
          insertValue === ''
            ? document.execCommand('delete', false)
            : document.execCommand('insertText', false, insertValue)
        input.setSelectionRange(newSelectionStart, newSelectionEnd)
      } catch (e) {
        execCommandResult = false
      }

      // If the execCommand method failed, call onChange instead - will nuke the undo history :(
      if (!execCommandResult) {
        const newValue = input.value.slice(0, replaceRange[0]) + insertValue + input.value.slice(replaceRange[1])

        // When building the event we could also define the inputType and data, but that would
        // be complex for the consumer to maintain. For now that's not functionality that is
        // strictly necessary.
        // React SyntheticChangeEvents are actually built around 'input' events, not 'change' events
        const event = new InputEvent('input', {bubbles: false})
        inputRef.current.value = newValue
        inputRef.current.setSelectionRange(newSelectionStart, newSelectionEnd)

        // Even though we call onChange manually, we must dispatch the event so the browser can
        // set its `target` and fully create it
        inputRef.current.dispatchEvent(event)

        // Surprisingly, dispatching the event does not cause React to call handlers, even
        // though it looks almost exactly like a normal 'input' event. Maybe it's because the
        // event is not trusted? So we have to build and dispatch the `SyntheticEvent` ourselves.
        // This is not perfect but it gets pretty close.
        fallbackEventHandler(SyntheticChangeEvent(event, inputRef.current))
      }
    },
    [inputRef, fallbackEventHandler],
  )
