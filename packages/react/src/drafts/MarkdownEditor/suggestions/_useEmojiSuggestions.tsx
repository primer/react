import React, {useMemo} from 'react'
import type {UseSuggestionsHook} from '.'
import {suggestionsCalculator} from '.'
import {ActionList} from '../../../ActionList'
import type {Suggestion, Trigger} from '../../InlineAutocomplete'

type BaseEmoji = {
  /** Name (shortcode) of the emoji. Do not include the wrapping `:` symbols. */
  name: string
}

type UnicodeEmoji = BaseEmoji & {
  /** Unicode representation of the emoji. */
  character: string
}

type CustomEmoji = BaseEmoji & {
  /** URL to an image of the emoji. */
  url: string
}

export type Emoji = UnicodeEmoji | CustomEmoji

const trigger: Trigger = {
  triggerChar: ':',
  keepTriggerCharOnCommit: false,
}

const emojiToSugggestion = (emoji: Emoji): Suggestion => ({
  value: 'character' in emoji ? emoji.character : `:${emoji.name}:`,
  key: emoji.name, // emoji characters may not be unique - ie haircut and haircut_man both have the same emoji codepoint. But names are guaranteed to be unique.
  render: props => (
    <ActionList.Item {...props}>
      <ActionList.LeadingVisual>
        {'character' in emoji ? (
          emoji.character
        ) : (
          <img src={emoji.url} alt={`${emoji.name} emoji`} height="16" width="16" />
        )}
      </ActionList.LeadingVisual>
      {emoji.name}
    </ActionList.Item>
  ),
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

export const useEmojiSuggestions: UseSuggestionsHook<Emoji> = emojis => {
  const calculateSuggestions = useMemo(
    () => suggestionsCalculator(emojis, scoreSuggestion, emojiToSugggestion),
    [emojis],
  )
  return {
    calculateSuggestions,
    trigger,
  }
}
