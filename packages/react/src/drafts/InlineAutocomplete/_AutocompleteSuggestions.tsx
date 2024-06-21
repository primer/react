import React, {useCallback, useRef, useState} from 'react'
import Spinner from '../../Spinner'
import type {ActionListItemProps} from '../../ActionList'
import {ActionList} from '../../ActionList'
import Box from '../../Box'
import type {ComboboxCommitEvent} from '../hooks/useCombobox'
import {useCombobox} from '../hooks/useCombobox'
import Overlay from '../../Overlay'

import type {Suggestion, Suggestions, SuggestionsPlacement, TextInputElement} from './types'
import {getSuggestionKey, getSuggestionValue} from './utils'
import type {CharacterCoordinates} from '../utils/character-coordinates'
import useIsomorphicLayoutEffect from '../../utils/useIsomorphicLayoutEffect'

type AutoCompleteSuggestionsProps = {
  suggestions: Suggestions | null
  portalName?: string
  triggerCharCoords: CharacterCoordinates
  onClose: () => void
  onCommit: (suggestion: string) => void
  inputRef: React.RefObject<TextInputElement>
  visible: boolean
  tabInsertsSuggestions: boolean
  defaultPlacement: SuggestionsPlacement
}

const LoadingIndicator = () => (
  <Box sx={{display: 'flex', justifyContent: 'center', py: 2}}>
    <Spinner size="small" />
  </Box>
)

const SuggestionListItem = ({suggestion}: {suggestion: Suggestion}) => {
  const value = getSuggestionValue(suggestion)

  const sharedProps: ActionListItemProps = {
    id: value,
    children: value,
    role: 'option',
    sx: {
      '&[aria-selected]': {
        backgroundColor: 'actionListItem.default.activeBg',
      },
      '&[data-combobox-option-default]:not([aria-selected])': {
        backgroundColor: 'actionListItem.default.selectedBg',
      },
    },
  }

  return typeof suggestion === 'string' ? <ActionList.Item {...sharedProps} /> : suggestion.render(sharedProps)
}

/**
 * Renders an overlayed list at the given relative coordinates. Handles keyboard navigation
 * and accessibility concerns.
 */
const AutocompleteSuggestions = ({
  suggestions,
  portalName,
  triggerCharCoords,
  onClose,
  onCommit: externalOnCommit,
  inputRef,
  visible,
  tabInsertsSuggestions,
  defaultPlacement,
}: AutoCompleteSuggestionsProps) => {
  const overlayRef = useRef<HTMLDivElement | null>(null)

  // It seems wierd to use state instead of a ref here, but because the list is inside an
  // AnchoredOverlay it is not always mounted - so we want to reinitialize the Combobox when it mounts
  const [list, setList] = useState<HTMLUListElement | null>(null)

  const onCommit = useCallback(
    ({option}: ComboboxCommitEvent<Suggestion>) => {
      externalOnCommit(getSuggestionValue(option))
    },
    [externalOnCommit],
  )

  // Setup keyboard navigation
  useCombobox({
    // Even though the list is visible when loading, we don't want to do keyboard binding in that case
    isOpen: visible && suggestions !== 'loading',
    listElement: list,
    inputElement: inputRef.current,
    onCommit,
    options: Array.isArray(suggestions) ? suggestions : [],
    tabInsertsSuggestions,
    defaultFirstOption: true,
  })

  const [top, setTop] = useState(0)
  useIsomorphicLayoutEffect(
    function recalculateTop() {
      const overlayHeight = overlayRef.current?.offsetHeight ?? 0

      const belowOffset = triggerCharCoords.top + triggerCharCoords.height
      const wouldOverflowBelow = belowOffset + overlayHeight > window.innerHeight

      const aboveOffset = triggerCharCoords.top - overlayHeight
      const wouldOverflowAbove = aboveOffset < 0

      // Only override the default if it would overflow in the default direction and it would not overflow in the override direction
      const result = {
        below: wouldOverflowBelow && !wouldOverflowAbove ? aboveOffset : belowOffset,
        above: wouldOverflowAbove && !wouldOverflowBelow ? belowOffset : aboveOffset,
      }[defaultPlacement]

      // Sometimes the value can be NaN if layout is not available (ie, SSR or JSDOM)
      const resultNotNaN = Number.isNaN(result) ? 0 : result

      setTop(resultNotNaN)
    },
    // this is a cheap effect and we want it to run when pretty much anything that could affect position changes
    [triggerCharCoords.top, triggerCharCoords.height, suggestions, visible, defaultPlacement],
  )

  // Conditional rendering appears wrong at first - it means that we are reconstructing the
  // Combobox instance every time the suggestions appear. But this is what we want - otherwise
  // the textarea would always have the `combobox` role, which is incorrect (a textarea should
  // not technically ever be a combobox). We compromise by dynamically applying the combobox
  // role only when suggestions are available.
  return visible ? (
    <Overlay
      onEscape={onClose}
      onClickOutside={onClose}
      returnFocusRef={inputRef}
      preventFocusOnOpen
      portalContainerName={portalName}
      sx={{position: 'fixed'}}
      top={top}
      left={triggerCharCoords.left}
      ref={overlayRef}
    >
      <ActionList ref={setList} role="listbox">
        {suggestions === 'loading' ? (
          <LoadingIndicator />
        ) : (
          suggestions?.map(suggestion => (
            <SuggestionListItem suggestion={suggestion} key={getSuggestionKey(suggestion)} />
          ))
        )}
      </ActionList>
    </Overlay>
  ) : (
    <></>
  )
}
AutocompleteSuggestions.displayName = 'SuggestionList'

export default AutocompleteSuggestions
