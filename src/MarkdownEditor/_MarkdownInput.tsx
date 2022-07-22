import {subscribe as subscribeToMarkdownPasting} from '@github/paste-markdown'
import React, {forwardRef, useEffect, useMemo, useState} from 'react'
import {useDynamicTextareaHeight} from '../hooks'
import {useCombinedRefs} from '../hooks/useCombinedRefs'
import InlineAutocomplete, {ShowSuggestionsEvent, Suggestions, Trigger} from '../InlineAutocomplete'
import Textarea, {TextareaProps} from '../Textarea'
import {
  EmojiSuggestionHandler,
  MentionSuggestionHandler,
  ReferenceSuggestionHandler,
  useEmojiSuggestions,
  useMentionSuggestions,
  useReferenceSuggestions
} from './_useSuggestions'

interface MarkdownInputProps extends Omit<TextareaProps, 'onChange'> {
  value: string
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>
  disabled?: boolean
  placeholder?: string
  id: string
  maxLength?: number
  fullHeight?: boolean
  isDraggedOver: boolean
  onSuggestEmojis?: EmojiSuggestionHandler
  onSuggestMentions?: MentionSuggestionHandler
  onSuggestReferences?: ReferenceSuggestionHandler
  minHeightLines: number
  maxHeightLines: number
  monospace: boolean
  /** Use this prop to control visibility instead of unmounting, so the undo stack and custom height are preserved. */
  visible: boolean
}

export const MarkdownInput = forwardRef<HTMLTextAreaElement, MarkdownInputProps>(
  (
    {
      value,
      onChange,
      disabled,
      placeholder,
      id,
      maxLength,
      onKeyDown,
      fullHeight,
      isDraggedOver,
      onSuggestEmojis,
      onSuggestMentions,
      onSuggestReferences,
      minHeightLines,
      maxHeightLines,
      visible,
      monospace,
      ...props
    },
    forwardedRef
  ) => {
    const [suggestions, setSuggestions] = useState<Suggestions | null>(null)

    const [mentionsTrigger, queryAndSetMentionSuggestions] = useMentionSuggestions({
      setSuggestions,
      calculateSuggestions: onSuggestMentions
    })
    const [referencesTrigger, queryAndSetReferenceSuggestions] = useReferenceSuggestions({
      setSuggestions,
      calculateSuggestions: onSuggestReferences
    })
    const [emojiTrigger, queryAndSetEmojiSuggestions] = useEmojiSuggestions({
      setSuggestions,
      calculateSuggestions: onSuggestEmojis
    })
    const triggers = useMemo(
      () => [mentionsTrigger, referencesTrigger, emojiTrigger].filter((t): t is Trigger => t !== null),
      [mentionsTrigger, referencesTrigger, emojiTrigger]
    )

    const onShowSuggestions = (event: ShowSuggestionsEvent) => {
      if (event.trigger.triggerChar === mentionsTrigger?.triggerChar) {
        queryAndSetMentionSuggestions(event.query)
      } else if (event.trigger.triggerChar === referencesTrigger?.triggerChar) {
        queryAndSetReferenceSuggestions(event.query)
      } else if (event.trigger.triggerChar === emojiTrigger?.triggerChar) {
        queryAndSetEmojiSuggestions(event.query)
      }
    }

    const [element, setElement] = useState<HTMLTextAreaElement | null>(null)
    const ref = useCombinedRefs(forwardedRef, setElement)

    useEffect(() => (element ? subscribeToMarkdownPasting(element).unsubscribe : undefined), [element])

    const dynamicHeightStyles = useDynamicTextareaHeight({maxHeightLines, minHeightLines, element, value})
    const heightStyles = fullHeight ? {} : dynamicHeightStyles

    return (
      <InlineAutocomplete
        triggers={triggers}
        suggestions={suggestions}
        onShowSuggestions={onShowSuggestions}
        onHideSuggestions={() => setSuggestions(null)}
        sx={{flex: 'auto'}}
      >
        <Textarea
          id={id}
          ref={ref}
          placeholder={placeholder}
          maxLength={maxLength}
          value={value}
          onKeyDown={onKeyDown}
          disabled={disabled}
          aria-label="Markdown value"
          onChange={onChange}
          sx={{
            width: '100%',
            borderStyle: 'none',
            height: fullHeight ? '100%' : undefined,
            boxShadow: isDraggedOver ? 'primer.shadow.focus' : 'none',
            display: visible ? undefined : 'none',
            '& textarea': {
              lineHeight: 1.2,
              resize: fullHeight ? 'none' : 'vertical',
              p: 2,
              fontFamily: monospace ? 'mono' : 'normal',
              ...heightStyles
            }
          }}
          {...props}
        />
      </InlineAutocomplete>
    )
  }
)
MarkdownInput.displayName = 'MarkdownInput'
