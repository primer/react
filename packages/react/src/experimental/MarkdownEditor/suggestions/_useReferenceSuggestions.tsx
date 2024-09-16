import React, {useMemo} from 'react'
import type {UseSuggestionsHook} from '.'
import {suggestionsCalculator} from '.'
import {ActionList} from '../../../ActionList'
import type {Suggestion, Trigger} from '../../InlineAutocomplete'
import Text from '../../../Text'
import {score} from 'fzy.js'

export type Reference = {
  titleHtml: string
  titleText: string
  id: string
  iconHtml?: string
}

const trigger: Trigger = {
  triggerChar: '#',
  multiWord: true,
}

const referenceToSuggestion = (reference: Reference): Suggestion => ({
  value: reference.id,
  render: props => (
    <ActionList.Item {...props}>
      {reference.iconHtml && (
        <ActionList.LeadingVisual>
          <span dangerouslySetInnerHTML={{__html: reference.iconHtml}} />
        </ActionList.LeadingVisual>
      )}
      <Text
        sx={{
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          display: 'block',
          overflow: 'hidden',
          maxWidth: 400,
        }}
      >
        <span dangerouslySetInnerHTML={{__html: reference.titleHtml}} />
      </Text>{' '}
      <ActionList.Description>#{reference.id}</ActionList.Description>
    </ActionList.Item>
  ),
})

const scoreSuggestion = (query: string, reference: Reference): number => {
  // fzy unituitively returns Infinity if the length of the item is less than or equal to the length of the query
  const fzyScore = score(query, `${reference.id} ${reference.titleText}`)
  // Here, unlike for mentionables, we don't need to check for equality because the user's query
  // can never equal the search string (we don't do filtering if the query is in "#123 some text" form)
  return fzyScore === Infinity ? -Infinity : fzyScore
}

export const useReferenceSuggestions: UseSuggestionsHook<Reference> = references => {
  const calculateSuggestions = useMemo(() => {
    const calculator = suggestionsCalculator(references, scoreSuggestion, referenceToSuggestion)
    return async (query: string) => {
      if (/^\d+\s/.test(query)) return [] // don't return anything if the query is in the form #123 ..., assuming they already have the number they want
      return calculator(query)
    }
  }, [references])
  return {
    calculateSuggestions,
    trigger,
  }
}
