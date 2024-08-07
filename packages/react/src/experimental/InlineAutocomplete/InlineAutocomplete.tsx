import React, {cloneElement, useRef} from 'react'
import Box from '../../Box'
import Portal from '../../Portal'
import type {BetterSystemStyleObject} from '../../sx'
import {useSyntheticChange} from '../hooks/useSyntheticChange'
import {getAbsoluteCharacterCoordinates} from '../utils/character-coordinates'

import type {
  SelectSuggestionsEvent,
  ShowSuggestionsEvent,
  Suggestions,
  SuggestionsPlacement,
  TextInputCompatibleChild,
  TextInputElement,
  Trigger,
} from './types'
import {augmentHandler, calculateSuggestionsQuery, getSuggestionValue, requireChildrenToBeInput} from './utils'

import {useRefObjectAsForwardedRef} from '../../hooks'
import AutocompleteSuggestions from './_AutocompleteSuggestions'
import {useFormControlForwardedProps} from '../../FormControl'

export type InlineAutocompleteProps = {
  /** Register the triggers that can cause suggestions to appear. */
  triggers: Array<Trigger>
  /**
   * Called when a valid suggestion query is updated. This should be handled by setting the
   * `suggestions` prop accordingly.
   */
  onShowSuggestions: (event: ShowSuggestionsEvent) => void

  /**
   * Called when a suggestion is selected.
   *
   * @note This should be used only for performing side effects, not for modifying
   * the inserted text. Do not call `setState` in this handler or the user's cursor
   * position / undo history could be lost.
   */
  onSelectSuggestion?: (event: SelectSuggestionsEvent) => void

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
   * If `true`, suggestions will be applied with both `Tab` and `Enter`, instead of just
   * `Enter`. This may be expected behavior for users used to IDEs, but use caution when
   * hijacking browser tabbing capability.
   * @default false
   */
  tabInsertsSuggestions?: boolean
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
  /**
   * Control which side of the insertion point the suggestions list appears on by default. This
   * should almost always be `"below"` because it typically provides a better user experience
   * (the most-relevant suggestions will appear closest to the text). However, if the input
   * is always near the bottom of the screen (ie, a chat composition form), it may be better to
   * display the suggestions above the input.
   *
   * In either case, if there is not enough room to display the suggestions in the default direction,
   * the suggestions will appear in the other direction.
   * @default "below"
   */
  suggestionsPlacement?: SuggestionsPlacement
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
 * @deprecated Will be removed in v37 (https://github.com/primer/react/issues/3604)
 */
const InlineAutocomplete = ({
  triggers,
  suggestions,
  onShowSuggestions,
  onHideSuggestions,
  onSelectSuggestion,
  sx,
  children,
  tabInsertsSuggestions = false,
  suggestionsPlacement = 'below',
  ...externalInputProps
}: InlineAutocompleteProps & React.ComponentProps<'textarea' | 'input'>) => {
  const inputProps = useFormControlForwardedProps(externalInputProps)

  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null)
  useRefObjectAsForwardedRef(children.ref && typeof children.ref !== 'string' ? children.ref : noop, inputRef)

  const externalInput = requireChildrenToBeInput(children, inputRef)

  const emitSyntheticChange = useSyntheticChange({
    inputRef,
    fallbackEventHandler: externalInput.props.onChange ?? noop,
  })

  /** Stores the query that caused the current suggestion list to appear. */
  const showEventRef = useRef<ShowSuggestionsEvent | null>(null)

  const suggestionsVisible = suggestions !== null && suggestions.length > 0

  // The suggestions don't usually move while open, so it seems as though this could be
  // optimized by only re-rendering when suggestionsVisible changes. However, the user
  // could move the cursor to a different location using arrow keys and then type a
  // trigger, which would move the suggestions without closing/reopening them.
  const triggerCharCoords =
    inputRef.current && showEventRef.current && suggestionsVisible
      ? getAbsoluteCharacterCoordinates(
          inputRef.current,
          (getSelectionStart(inputRef.current) ?? 0) - showEventRef.current.query.length,
        )
      : {top: 0, left: 0, height: 0}

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

    onSelectSuggestion?.({suggestion, trigger, query})

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
    ...inputProps,
    onBlur: augmentHandler(externalInput.props.onBlur, onBlur),
    onKeyDown: augmentHandler(externalInput.props.onKeyDown, onKeyDown),
    onChange: augmentHandler(externalInput.props.onChange, onChange),
    ref: inputRef,
  })

  /**
   * Even though we apply all the aria attributes, screen readers don't fully support this
   * dynamic use case and so they don't have a native way to indicate to the user when
   * there are suggestions available. So we use some hidden text with aria-live to politely
   * indicate what's available and how to use it.
   *
   * This text should be consistent and the important info should be first, because users
   * will hear it as they type - if they have heard the message before they should be able
   * to recognize it and quickly apply the first suggestion without listening to the rest
   * of the message.
   *
   * When screen reader users navigate using arrow keys, the `aria-activedescendant` will
   * change and will be read out so we don't need to handle that interaction here.
   */
  const suggestionsDescription = !suggestionsVisible
    ? ''
    : suggestions === 'loading'
    ? 'Loading autocomplete suggestions…'
    : // It's important to include both Enter and Tab because we are telling the user that we are hijacking these keys:
      `${suggestions.length} autocomplete ${
        suggestions.length === 1 ? 'suggestion' : 'suggestions'
      } available; "${getSuggestionValue(suggestions[0])}" is highlighted. Press ${
        tabInsertsSuggestions ? 'Enter or Tab' : 'Enter'
      } to insert.`

  return (
    // Try to get as close as possible to making the container 'invisible' by making it shrink tight to child input
    <Box sx={{display: 'inline-block', '& > *': {width: '100%'}, ...sx, position: 'relative'}}>
      {input}
      <AutocompleteSuggestions
        suggestions={suggestions}
        inputRef={inputRef}
        onCommit={onCommit}
        onClose={onHideSuggestions}
        triggerCharCoords={triggerCharCoords}
        visible={suggestionsVisible}
        tabInsertsSuggestions={tabInsertsSuggestions}
        defaultPlacement={suggestionsPlacement}
      />

      <Portal>
        {/* This should NOT be linked to the input with aria-describedby or screen readers may not read the live updates.
        The assertive live attribute ensures the suggestions are read instead of the input label, which voiceover will try to re-read when the role changes. */}
        <span aria-live="assertive" aria-atomic style={{clipPath: 'circle(0)', position: 'absolute'}}>
          {suggestionsDescription}
        </span>
      </Portal>
    </Box>
  )
}

export default InlineAutocomplete
