import {subscribe as subscribeToMarkdownPasting} from '@github/paste-markdown'
import React, {forwardRef, useEffect, useMemo, useRef, useState} from 'react'
import {useDynamicTextareaHeight} from '../hooks/useDynamicTextareaHeight'
import InlineAutocomplete, {ShowSuggestionsEvent, Suggestions} from '../InlineAutocomplete'
import Textarea, {TextareaProps} from '../../Textarea'
import {Emoji, useEmojiSuggestions} from './suggestions/_useEmojiSuggestions'
import {Mentionable, useMentionSuggestions} from './suggestions/_useMentionSuggestions'
import {Reference, useReferenceSuggestions} from './suggestions/_useReferenceSuggestions'
import {useRefObjectAsForwardedRef} from '../../hooks'

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
  emojiSuggestions?: Array<Emoji>
  mentionSuggestions?: Array<Mentionable>
  referenceSuggestions?: Array<Reference>
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
      emojiSuggestions,
      mentionSuggestions,
      referenceSuggestions,
      minHeightLines,
      maxHeightLines,
      visible,
      monospace,
      ...props
    },
    forwardedRef
  ) => {
    const [suggestions, setSuggestions] = useState<Suggestions | null>(null)

    const {trigger: emojiTrigger, calculateSuggestions: calculateEmojiSuggestions} = useEmojiSuggestions(
      emojiSuggestions ?? []
    )
    const {trigger: mentionsTrigger, calculateSuggestions: calculateMentionSuggestions} = useMentionSuggestions(
      mentionSuggestions ?? []
    )
    const {trigger: referencesTrigger, calculateSuggestions: calculateReferenceSuggestions} = useReferenceSuggestions(
      referenceSuggestions ?? []
    )

    const triggers = useMemo(
      () => [mentionsTrigger, referencesTrigger, emojiTrigger],
      [mentionsTrigger, referencesTrigger, emojiTrigger]
    )

    const onShowSuggestions = (event: ShowSuggestionsEvent) => {
      if (event.trigger.triggerChar === emojiTrigger.triggerChar) {
        setSuggestions(calculateEmojiSuggestions(event.query))
      } else if (event.trigger.triggerChar === mentionsTrigger.triggerChar) {
        setSuggestions(calculateMentionSuggestions(event.query))
      } else if (event.trigger.triggerChar === referencesTrigger.triggerChar) {
        setSuggestions(calculateReferenceSuggestions(event.query))
      }
    }

    const ref = useRef<HTMLTextAreaElement>(null)
    useRefObjectAsForwardedRef(forwardedRef, ref)

    useEffect(() => (ref.current ? subscribeToMarkdownPasting(ref.current).unsubscribe : undefined), [])

    const dynamicHeightStyles = useDynamicTextareaHeight({maxHeightLines, minHeightLines, element: ref.current, value})
    const heightStyles = fullHeight ? {} : dynamicHeightStyles

    return (
      <InlineAutocomplete
        triggers={triggers}
        suggestions={suggestions}
        onShowSuggestions={onShowSuggestions}
        onHideSuggestions={() => setSuggestions(null)}
        sx={{flex: 'auto'}}
        tabInsertsSuggestions
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
