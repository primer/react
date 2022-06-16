import React, {cloneElement, useRef} from 'react'
import Box from '../Box'
import {useCombinedRefs} from '../hooks/useCombinedRefs'
import {useSyntheticChange} from '../hooks/useSyntheticChange'
import {BetterSystemStyleObject} from '../sx'

import {ShowSuggestionsEvent, Suggestions, TextInputCompatibleChild, TextInputElement, Trigger} from './types'
import {
  augmentHandler,
  calculateSuggestionsQuery,
  getAbsoluteCharacterCoordinates,
  requireChildrenToBeInput
} from './utils'
import AutocompleteSuggestions from './_AutocompleteSuggestions'

export interface InlineAutocompleteProps {
  /** Register the triggers that can cause suggestions to appear. */
  triggers: Array<Trigger>
  /**
   * Called when a valid suggestion query is updated. This should be handled by setting the
   * `suggestions` prop accordingly.
   */
  onShowSuggestions: (event: ShowSuggestionsEvent) => void
  /** Called when suggestions should be hidden. Set `suggestions` to `null` in this case. */
  onHideSuggestions: () => void
  /**
   * The currently visible list of suggestions. If `loading`, a loading indicator will be
   * shown. If `null` or empty, the list will be hidden. Suggestion sort will be preserved.
   *
   * Typically, this should not contain more than five or so suggestions.
   */
  suggestions: Suggestions | null
  /**
   * The `AutocompleteTextarea` has a container for positioning the suggestions overlay.
   * This can break some layouts (ie, if the editor must expand with `flex: 1` to fill space)
   * so you can override container styles here. Usually this should not be necessary.
   * `position` may not be overriden.
   */
  sx?: Omit<BetterSystemStyleObject, 'position'>
  // Typing this as such makes it look like a compatible child internally, but it isn't actually
  // enforced externally so we have to resort to a runtime assertion.
  /**
   * An `input` or `textarea` compatible component to extend. A compatible component is any
   * component that forwards a ref and props to an underlying `input` or `textarea` element,
   * including but not limited to `Input`, `TextArea`, `input`, `textarea`, `styled.input`,
   * and `styled.textarea`. If the child is not compatible, a runtime `TypeError` will be
   * thrown.
   */
  children: TextInputCompatibleChild
}

const getSelectionStart = (element: TextInputElement) => {
  try {
    return element.selectionStart
  } catch (e: unknown) {
    // Safari throws an exception when trying to access selectionStart on date input element
    if (e instanceof TypeError) return null
    throw e
  }
}

const noop = () => {
  // don't do anything
}

/**
 * Shows suggestions to complete the current word/phrase the user is actively typing.
 * This is different from your standard combobox because the pattern is not 'select an item
 * from a list', it's more 'suggest typing hints'.
 *
 * This component accepts a single child that has props compatible with either
 * `<input>` or `<textarea>`.
 */
const InlineAutocomplete = ({
  triggers,
  suggestions,
  onShowSuggestions,
  onHideSuggestions,
  sx,
  children
}: InlineAutocompleteProps) => {
  const inputRef = useCombinedRefs(children.ref)
  const externalInput = requireChildrenToBeInput(children, inputRef)

  const emitSyntheticChange = useSyntheticChange({
    inputRef,
    fallbackEventHandler: externalInput.props.onChange ?? noop
  })

  /** Stores the query that caused the current suggestion list to appear. */
  const showEventRef = useRef<ShowSuggestionsEvent | null>(null)

  const suggestionsVisible = suggestions !== null && suggestions.length > 0

  // The suggestions don't usually move while open, so it seems as though this could be
  // optimized by only re-rendering when suggestionsVisible changes. However, the user
  // could move the cursor to a different location using arrow keys and then type a
  // trigger, which would move the suggestions without closing/reopening them.
  const suggestionsOffset =
    inputRef.current && showEventRef.current && suggestionsVisible
      ? getAbsoluteCharacterCoordinates(
          inputRef.current,
          // Position the suggestions at the trigger character, not the current caret position
          (getSelectionStart(inputRef.current) ?? 0) - showEventRef.current.query.length
        )
      : {top: 0, left: 0}

  // User can blur while suggestions are visible with shift+tab
  const onBlur: React.FocusEventHandler<TextInputElement> = () => {
    onHideSuggestions()
  }

  // Even though the overlay has an Escape listener, it only works when focus is inside
  // the overlay; in this case the textarea is focused
  const onKeyDown: React.KeyboardEventHandler<TextInputElement> = event => {
    if (suggestionsVisible && event.key === 'Escape') {
      onHideSuggestions()
      event.stopPropagation()
    }
  }

  const onChange: React.ChangeEventHandler<TextInputElement> = event => {
    const selectionStart = getSelectionStart(event.currentTarget)
    if (selectionStart === null) {
      onHideSuggestions()
      return
    }

    showEventRef.current = calculateSuggestionsQuery(triggers, event.currentTarget.value, selectionStart)

    if (showEventRef.current) {
      onShowSuggestions(showEventRef.current)
    } else {
      onHideSuggestions()
    }
  }

  const onCommit = (suggestion: string) => {
    if (!inputRef.current || !showEventRef.current) return
    const {query, trigger} = showEventRef.current

    const currentCaretPosition = getSelectionStart(inputRef.current) ?? 0
    const deleteLength = query.length + trigger.triggerChar.length
    const startIndex = currentCaretPosition - deleteLength

    const keepTriggerChar = trigger.keepTriggerCharOnCommit ?? true
    const maybeTriggerChar = keepTriggerChar ? trigger.triggerChar : ''
    const replacement = `${maybeTriggerChar}${suggestion} `

    emitSyntheticChange(replacement, [startIndex, startIndex + deleteLength])
    onHideSuggestions()
  }

  const input = cloneElement(externalInput, {
    onBlur: augmentHandler(externalInput.props.onBlur, onBlur),
    onKeyDown: augmentHandler(externalInput.props.onKeyDown, onKeyDown),
    onChange: augmentHandler(externalInput.props.onChange, onChange),
    ref: inputRef
  })

  return (
    // Try to get as close as possible to making the container 'invisible' by making it shrink
    // tight to child input
    <Box sx={{display: 'inline-block', '& > *': {width: '100%'}, ...sx, position: 'relative'}}>
      {input}
      <AutocompleteSuggestions
        suggestions={suggestions}
        inputRef={inputRef}
        onCommit={onCommit}
        onClose={onHideSuggestions}
        top={suggestionsOffset.top}
        left={suggestionsOffset.left}
        visible={suggestionsVisible}
      />
    </Box>
  )
}

export default InlineAutocomplete
