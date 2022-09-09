import {score} from 'fzy.js'
import React from 'react'
import {suggestionsCalculator, UseSuggestionsHook} from '.'
import {ActionList} from '../../../ActionList'
import {Suggestion, Trigger} from '../../InlineAutocomplete'
import Text from '../../../Text'

/** Could be a user, team, or organization - anything that can be mentioned. */
export type Mentionable = {
  description: string
  /** The ID of the team or the login of the user. Do not include the `@` symbol. */
  identifier: string
}

const trigger: Trigger = {
  triggerChar: '@'
}

const mentionableToSuggestion = (mentionable: Mentionable): Suggestion => ({
  value: mentionable.identifier,
  render: props => (
    <ActionList.Item {...props}>
      <Text sx={{fontWeight: 'bold'}}>{mentionable.identifier}</Text>{' '}
      <ActionList.Description>{mentionable.description}</ActionList.Description>
    </ActionList.Item>
  )
})

const scoreSuggestion = (query: string, mentionable: Mentionable): number =>
  score(query, `${mentionable.identifier} ${mentionable.description}`.trim().toLowerCase())

export const useMentionSuggestions: UseSuggestionsHook<Mentionable> = mentionables => ({
  calculateSuggestions: suggestionsCalculator(mentionables, scoreSuggestion, mentionableToSuggestion),
  trigger
})
