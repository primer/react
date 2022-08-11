import React from 'react'
import {suggestionsCalculator, UseSuggestionsHook} from '.'
import {ActionList} from '../../../ActionList'
import {Suggestion, Trigger} from '../../InlineAutocomplete'

export type Emoji = {
  /** Name (shortcode) of the emoji. Do not include the wrapping `:` symbols. */
  name: string
  /** Unicode representation of the emoji. */
  character: string
}

const trigger: Trigger = {
  triggerChar: ':',
  keepTriggerCharOnCommit: false
}

const emojiToSugggestion = (emoji: Emoji): Suggestion => ({
  value: emoji.character,
  key: emoji.name, // emoji characters may not be unique - ie haircut and haircut_man both have the same emoji codepoint. But names are guarunteed to be unique.
  render: props => (
    <ActionList.Item {...props} sx={{...props.sx, '& > span:first-child': {display: 'none'}}}>
      <ActionList.LeadingVisual>{emoji.character}</ActionList.LeadingVisual>
      {emoji.name}
    </ActionList.Item>
  )
})

// for emojis we don't use a fuzzy search because they are short and easy to accurately search through
const scoreSuggestion = (query: string, emoji: Emoji): number => {
  const name = emoji.name.toLowerCase()
  const q = query.toLowerCase()

  let score = 0
  if (name.includes(q)) {
    score += 5
    if (name.startsWith(q)) score += 5
  }

  return score
}

export const useEmojiSuggestions: UseSuggestionsHook<Emoji> = emojis => ({
  calculateSuggestions: suggestionsCalculator(emojis, scoreSuggestion, emojiToSugggestion),
  trigger
})
