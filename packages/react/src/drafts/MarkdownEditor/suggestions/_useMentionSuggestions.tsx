import {score} from 'fzy.js'
import React, {useMemo} from 'react'
import type {UseSuggestionsHook} from '.'
import {suggestionsCalculator} from '.'
import {ActionList} from '../../../ActionList'
import type {Suggestion, Trigger} from '../../InlineAutocomplete'
import Text from '../../../Text'

/** Could be a user, team, or organization - anything that can be mentioned. */
export type Mentionable = {
  description: string
  /** The ID of the team or the login of the user. Do not include the `@` symbol. */
  identifier: string
}

const trigger: Trigger = {
  triggerChar: '@',
}

const mentionableToSuggestion = (mentionable: Mentionable): Suggestion => ({
  value: mentionable.identifier,
  render: props => (
    <ActionList.Item {...props}>
      <Text sx={{fontWeight: 'bold'}}>{mentionable.identifier}</Text>{' '}
      <ActionList.Description>{mentionable.description}</ActionList.Description>
    </ActionList.Item>
  ),
})

const scoreSuggestion = (query: string, mentionable: Mentionable): number => {
  const fzyScore = score(query, `${mentionable.identifier} ${mentionable.description}`.trim().toLowerCase())

  // fzy unintuitively returns Infinity if the length of the item is less than or equal to the length of the query
  // All users have an identifier but some have empty descriptions; in those cases the query might equal the identifier
  // and we'd still want to show the suggestion in that case.
  if (fzyScore === Infinity && query.toLowerCase() !== mentionable.identifier.toLowerCase()) return -Infinity

  return fzyScore
}

export const useMentionSuggestions: UseSuggestionsHook<Mentionable> = mentionables => {
  const calculateSuggestions = useMemo(
    () => suggestionsCalculator(mentionables, scoreSuggestion, mentionableToSuggestion),
    [mentionables],
  )
  return {
    calculateSuggestions,
    trigger,
  }
}
