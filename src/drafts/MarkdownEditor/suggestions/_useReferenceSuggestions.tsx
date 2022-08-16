import React from 'react'
import {suggestionsCalculator, UseSuggestionsHook} from '.'
import {ActionList} from '../../../ActionList'
import {Suggestion, Trigger} from '../../InlineAutocomplete'
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
  multiWord: true
}

const referenceToSuggestion = (reference: Reference): Suggestion => ({
  value: reference.id,
  render: props => (
    <ActionList.Item {...props} sx={{...props.sx, '& > span:first-child': {display: 'none'}}}>
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
          maxWidth: 400
        }}
      >
        <span dangerouslySetInnerHTML={{__html: reference.titleHtml}} />
      </Text>{' '}
      <ActionList.Description>#{reference.id}</ActionList.Description>
    </ActionList.Item>
  )
})

const scoreSuggestion = (query: string, reference: Reference): number =>
  score(query, `${reference.id} ${reference.titleText}`)

export const useReferenceSuggestions: UseSuggestionsHook<Reference> = references => ({
  calculateSuggestions: (query: string) => {
    if (/^\d+\s/.test(query)) return [] // don't return anything if the query is in the form #123 ..., assuming they already have the number they want
    return suggestionsCalculator(references, scoreSuggestion, referenceToSuggestion)(query)
  },
  trigger
})
