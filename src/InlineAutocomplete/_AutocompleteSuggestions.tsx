import React, {useCallback, useState} from 'react'
import {Spinner} from '..'
import {ActionList, ActionListItemProps} from '../ActionList'
import Box from '../Box'
import {ComboboxCommitEvent, useCombobox} from '../hooks'
import Overlay from '../Overlay'

import {Suggestion, Suggestions, TextInputElement} from './types'
import {getSuggestionKey, getSuggestionValue} from './utils'

interface AutoCompleteSuggestionsProps {
  suggestions: Suggestions | null
  portalName?: string
  // make top/left primitives instead of a Coordinates object to avoid extra re-renders
  top: number
  left: number
  onClose: () => void
  onCommit: (suggestion: string) => void
  inputRef: React.RefObject<TextInputElement>
  visible: boolean
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
      '&[aria-selected="true"]': {
        backgroundColor: 'actionListItem.default.selectedBg'
      }
    }
  }

  return <>{typeof suggestion === 'string' ? <ActionList.Item {...sharedProps} /> : suggestion.render(sharedProps)}</>
}

/**
 * Renders an overlayed list at the given relative coordinates. Handles keyboard navigation
 * and accessibility concerns.
 */
const AutocompleteSuggestions = ({
  suggestions,
  portalName,
  top,
  left,
  onClose,
  onCommit: externalOnCommit,
  inputRef,
  visible
}: AutoCompleteSuggestionsProps) => {
  // It seems wierd to use state instead of a ref here, but because the list is inside an
  // AnchoredOverlay it is not always mounted - so we want to reinitialize the Combobox when it mounts
  const [list, setList] = useState<HTMLUListElement | null>(null)

  const onCommit = useCallback(
    ({option}: ComboboxCommitEvent<Suggestion>) => {
      externalOnCommit(getSuggestionValue(option))
    },
    [externalOnCommit]
  )

  // Setup keyboard navigation
  useCombobox({
    // Even though the list is visible when loading, we don't want to do keyboard binding in that case
    isOpen: visible && suggestions !== 'loading',
    listElement: list,
    inputElement: inputRef.current,
    onCommit,
    options: Array.isArray(suggestions) ? suggestions : []
  })

  return visible ? (
    <Overlay
      onEscape={onClose}
      onClickOutside={onClose}
      returnFocusRef={inputRef}
      preventFocusOnOpen
      portalContainerName={portalName}
      sx={{position: 'fixed'}}
      {...{top, left}}
    >
      <ActionList selectionVariant="single" ref={setList}>
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
