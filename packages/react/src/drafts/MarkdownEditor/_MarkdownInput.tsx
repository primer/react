import {subscribe as subscribeToMarkdownPasting} from '@github/paste-markdown'
import React, {forwardRef, useEffect, useMemo, useRef, useState} from 'react'
import {useDynamicTextareaHeight} from '../hooks/useDynamicTextareaHeight'
import type {ShowSuggestionsEvent, Suggestions} from '../InlineAutocomplete'
import InlineAutocomplete from '../InlineAutocomplete'
import type {TextareaProps} from '../../Textarea'
import Textarea from '../../Textarea'
import type {Emoji} from './suggestions/_useEmojiSuggestions'
import {useEmojiSuggestions} from './suggestions/_useEmojiSuggestions'
import type {Mentionable} from './suggestions/_useMentionSuggestions'
import {useMentionSuggestions} from './suggestions/_useMentionSuggestions'
import type {Reference} from './suggestions/_useReferenceSuggestions'
import {useReferenceSuggestions} from './suggestions/_useReferenceSuggestions'
import {useRefObjectAsForwardedRef} from '../../hooks'
import type {SuggestionOptions} from './suggestions'

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
  emojiSuggestions?: SuggestionOptions<Emoji>
  mentionSuggestions?: SuggestionOptions<Mentionable>
  referenceSuggestions?: SuggestionOptions<Reference>
  minHeightLines: number
  maxHeightLines: number
  monospace: boolean
  pasteUrlsAsPlainText: boolean
  /** Use this prop to control visibility instead of unmounting, so the undo stack and custom height are preserved. */
  visible: boolean
}

const emptyArray: [] = [] // constant reference to avoid re-running effects

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
      pasteUrlsAsPlainText,
      ...props
    },
    forwardedRef,
  ) => {
    const [suggestions, setSuggestions] = useState<Suggestions | null>(null)
    const [event, setEvent] = useState<ShowSuggestionsEvent | null>(null)

    const {trigger: emojiTrigger, calculateSuggestions: calculateEmojiSuggestions} = useEmojiSuggestions(
      emojiSuggestions ?? emptyArray,
    )
    const {trigger: mentionsTrigger, calculateSuggestions: calculateMentionSuggestions} = useMentionSuggestions(
      mentionSuggestions ?? emptyArray,
    )
    const {trigger: referencesTrigger, calculateSuggestions: calculateReferenceSuggestions} = useReferenceSuggestions(
      referenceSuggestions ?? emptyArray,
    )

    const triggers = useMemo(
      () => [mentionsTrigger, referencesTrigger, emojiTrigger],
      [mentionsTrigger, referencesTrigger, emojiTrigger],
    )

    const lastEventRef = useRef<ShowSuggestionsEvent | null>(null)

    const onHideSuggestions = () => {
      setEvent(null)
      setSuggestions(null) // the effect would do this anyway, but this allows React to batch the update
    }

    // running the calculation in an effect (rather than in the onShowSuggestions handler) allows us
    // to automatically recalculate if the suggestions change while the menu is open
    useEffect(() => {
      if (!event) {
        setSuggestions(null)
        return
      }

      ;(async function () {
        lastEventRef.current = event
        setSuggestions('loading')
        if (event.trigger.triggerChar === emojiTrigger.triggerChar) {
          setSuggestions(await calculateEmojiSuggestions(event.query))
        } else if (event.trigger.triggerChar === mentionsTrigger.triggerChar) {
          setSuggestions(await calculateMentionSuggestions(event.query))
        } else if (event.trigger.triggerChar === referencesTrigger.triggerChar) {
          setSuggestions(await calculateReferenceSuggestions(event.query))
        }
      })()
    }, [
      event,
      calculateEmojiSuggestions,
      calculateMentionSuggestions,
      calculateReferenceSuggestions,
      // The triggers never actually change because they are statically defined
      emojiTrigger,
      mentionsTrigger,
      referencesTrigger,
    ])

    const ref = useRef<HTMLTextAreaElement>(null)
    useRefObjectAsForwardedRef(forwardedRef, ref)

    useEffect(() => {
      const subscription =
        ref.current &&
        subscribeToMarkdownPasting(ref.current, {defaultPlainTextPaste: {urlLinks: pasteUrlsAsPlainText}})
      return subscription?.unsubscribe
    }, [pasteUrlsAsPlainText])

    const heightStyles = useDynamicTextareaHeight({
      // if fullHeight is enabled, there is no need to compute a dynamic height (for perfs reasons)
      disabled: fullHeight,
      maxHeightLines,
      minHeightLines,
      elementRef: ref,
      value,
    })

    return (
      <InlineAutocomplete
        triggers={triggers}
        suggestions={suggestions}
        onShowSuggestions={setEvent}
        onHideSuggestions={onHideSuggestions}
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
            borderStyle: 'none',
            boxShadow: 'none',
            height: fullHeight ? '100%' : undefined,
            outline: theme => {
              return isDraggedOver ? `dashed 2px ${theme.colors.border.muted}` : undefined
            },
            outlineOffset: '-4px',
            display: visible ? undefined : 'none',
            '&: focus-within': {
              boxShadow: 'none',
              outline: 'none',
            },
            '& textarea': {
              lineHeight: 'var(--text-body-lineHeight-medium, 1.4285)',
              resize: fullHeight ? 'none' : 'vertical',
              p: 3,
              fontFamily: monospace ? 'mono' : 'normal',
              ...heightStyles,
            },
          }}
          {...props}
        />
      </InlineAutocomplete>
    )
  },
)
MarkdownInput.displayName = 'MarkdownInput'
