import React from 'react'
import {ActionList} from '../ActionList'
import {Suggestion, Suggestions, Trigger} from '../InlineAutocomplete'
import Text from '../Text'

type SuggestionHandler<T> = (query: string) => T[] | Promise<T[]>

type UseSuggestionsSettings<T> = {
  setSuggestions?: (suggestions: Suggestions) => void
  calculateSuggestions?: SuggestionHandler<T>
}

const useSuggestions = <T extends unknown>({
  setSuggestions,
  calculateSuggestions,
  convertSuggestion,
  trigger
}: UseSuggestionsSettings<T> & {convertSuggestion: (t: T) => Suggestion; trigger: Trigger}) => {
  const queryAndSetSuggestions = async (query: string) => {
    if (!setSuggestions) return

    const suggestions = calculateSuggestions?.(query) ?? []
    if (!Array.isArray(suggestions)) setSuggestions('loading')

    setSuggestions((await suggestions).map(convertSuggestion))
  }

  return [calculateSuggestions ? trigger : null, queryAndSetSuggestions] as const
}

// --- emojis ---

export type Emoji = {
  /** Name (shortcode) of the emoji. Do not include the wrapping `:` symbols. */
  name: string
  /** Unicode representation of the emoji. */
  character: string
}

export type EmojiSuggestionHandler = SuggestionHandler<Emoji>

const emojiTrigger: Trigger = {
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

export const useEmojiSuggestions = (settings: UseSuggestionsSettings<Emoji>) =>
  useSuggestions({
    ...settings,
    convertSuggestion: emojiToSugggestion,
    trigger: emojiTrigger
  })

// --- mentions ---

/** Could be a user, team, or organization - anything that can be mentioned. */
export type Mentionable = {
  description: string
  /** The ID of the team or the login of the user. Do not include the `@` symbol. */
  identifier: string
}

export type MentionSuggestionHandler = SuggestionHandler<Mentionable>

const mentionTrigger: Trigger = {
  triggerChar: '@'
}

const mentionableToSuggestion = (mentionable: Mentionable): Suggestion => ({
  value: mentionable.identifier,
  render: props => (
    <ActionList.Item {...props} sx={{...props.sx, '& > span': {display: 'none'}}}>
      <Text sx={{fontWeight: 'bold'}}>{mentionable.identifier}</Text>{' '}
      <ActionList.Description>{mentionable.description}</ActionList.Description>
    </ActionList.Item>
  )
})

export const useMentionSuggestions = (settings: UseSuggestionsSettings<Mentionable>) =>
  useSuggestions({
    ...settings,
    convertSuggestion: mentionableToSuggestion,
    trigger: mentionTrigger
  })

// --- references ---

export type Reference = {
  titleHtml: string
  titleText: string
  id: string
  iconHtml?: string
}

export type ReferenceSuggestionHandler = SuggestionHandler<Reference>

const referencesTrigger: Trigger = {
  triggerChar: '#',
  multiWord: true
}

const refenceToSuggestion = (reference: Reference): Suggestion => ({
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

export const useReferenceSuggestions = (settings: UseSuggestionsSettings<Reference>) =>
  useSuggestions({
    ...settings,
    convertSuggestion: refenceToSuggestion,
    trigger: referencesTrigger
  })
