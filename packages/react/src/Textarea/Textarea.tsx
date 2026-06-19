import type {TextareaHTMLAttributes, ReactElement} from 'react'
import React, {useEffect, useRef, useCallback, useId, useState, startTransition} from 'react'
import {TextInputBaseWrapper} from '../internal/components/TextInputWrapper'
import type {FormValidationStatus} from '../utils/types/FormValidationStatus'
import classes from './TextArea.module.css'
import type {WithSlotMarker} from '../utils/types'
import {AlertFillIcon} from '@primer/octicons-react'
import {getCharacterCountState, SCREEN_READER_DELAY} from '../utils/character-counter'
import VisuallyHidden from '../_VisuallyHidden'
import Text from '../Text'
import {clsx} from 'clsx'

export const DEFAULT_TEXTAREA_ROWS = 7
export const DEFAULT_TEXTAREA_COLS = 30
export const DEFAULT_TEXTAREA_RESIZE = 'both'

export type TextareaProps = {
  /**
   * Apply inactive visual appearance to the Textarea
   */
  disabled?: boolean
  /**
   * Indicates whether the Textarea validation state
   */
  validationStatus?: FormValidationStatus
  /**
   * Block
   */
  block?: boolean
  /**
   * Allows resizing of the textarea
   */
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'
  /**
   * apply a high contrast color to background
   */
  contrast?: boolean
  /**
   * The className to apply to the wrapper element
   */
  className?: string
  /**
   * The minimum height of the Textarea
   */
  minHeight?: number
  /**
   * The maximum height of the Textarea
   */
  maxHeight?: number
  /**
   * CSS styles to apply to the Textarea
   */
  style?: React.CSSProperties
  /**
   * Optional character limit for the textarea. If provided, a character counter will be displayed below the textarea.
   * When the limit is exceeded, validation styling will be applied.
   */
  characterLimit?: number
} & TextareaHTMLAttributes<HTMLTextAreaElement>

/**
 * An accessible, native textarea component that supports validation states.
 * This component accepts all native HTML <textarea> attributes as props.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      value,
      disabled,
      required,
      validationStatus,
      rows = DEFAULT_TEXTAREA_ROWS,
      cols = DEFAULT_TEXTAREA_COLS,
      resize = DEFAULT_TEXTAREA_RESIZE,
      block,
      contrast,
      className,
      minHeight,
      maxHeight,
      style,
      characterLimit,
      onChange,
      defaultValue,
      ...rest
    }: TextareaProps,
    ref,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): ReactElement<any> => {
    const characterCountId = useId()
    const characterCountStaticMessageId = useId()

    // For uncontrolled usage we track the length of the textarea's content so the
    // character counter can be derived during render rather than synced from an
    // effect (which would trigger an extra render on every keystroke). For
    // controlled usage the `value` prop is the source of truth.
    const isControlled = value !== undefined
    const [uncontrolledLength, setUncontrolledLength] = useState(() =>
      defaultValue !== undefined ? String(defaultValue).length : 0,
    )
    const currentLength = isControlled ? String(value).length : uncontrolledLength

    // The counter and validation state are derived directly from the current
    // length, so they stay in sync with the input without an extra render.
    const counter = characterLimit ? getCharacterCountState(currentLength, characterLimit) : undefined
    const isOverLimit = counter?.isOverLimit ?? false

    // The screen reader announcement is the only genuinely asynchronous piece: it
    // is debounced and applied as a transition so it never blocks typing.
    const [screenReaderMessage, setScreenReaderMessage] = useState('')
    const announceTimeoutRef = useRef<number | null>(null)

    const announceCharacterCount = useCallback(
      (length: number) => {
        if (!characterLimit || typeof window === 'undefined') {
          return
        }
        if (announceTimeoutRef.current) {
          clearTimeout(announceTimeoutRef.current)
        }
        const {message} = getCharacterCountState(length, characterLimit)
        announceTimeoutRef.current = window.setTimeout(() => {
          startTransition(() => {
            setScreenReaderMessage(message)
          })
        }, SCREEN_READER_DELAY)
      },
      [characterLimit],
    )

    // Clear any pending announcement when the component unmounts.
    useEffect(() => {
      return () => {
        if (announceTimeoutRef.current) {
          clearTimeout(announceTimeoutRef.current)
        }
      }
    }, [])

    // Handle textarea change with character counter
    const handleTextareaChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (characterLimit) {
          if (!isControlled) {
            setUncontrolledLength(e.target.value.length)
          }
          announceCharacterCount(e.target.value.length)
        }
        onChange?.(e)
      },
      [onChange, characterLimit, isControlled, announceCharacterCount],
    )

    const isValid = isOverLimit ? 'error' : validationStatus

    return (
      <>
        <TextInputBaseWrapper
          validationStatus={isValid}
          disabled={disabled}
          block={block}
          contrast={contrast}
          className={className}
        >
          <textarea
            value={value}
            defaultValue={defaultValue}
            data-resize={resize}
            aria-required={required}
            aria-invalid={isValid === 'error' ? 'true' : 'false'}
            ref={ref}
            disabled={disabled}
            rows={rows}
            cols={cols}
            className={classes.TextArea}
            onChange={handleTextareaChange}
            style={{
              minHeight,
              maxHeight,
              ...style,
            }}
            {...rest}
            aria-describedby={
              characterLimit
                ? [characterCountStaticMessageId, rest['aria-describedby']].filter(Boolean).join(' ') || undefined
                : rest['aria-describedby']
            }
          />
        </TextInputBaseWrapper>
        {characterLimit && (
          <>
            <VisuallyHidden aria-live="polite" role="status">
              {screenReaderMessage}
            </VisuallyHidden>
            <VisuallyHidden id={characterCountStaticMessageId}>
              You can enter up to {characterLimit} {characterLimit === 1 ? 'character' : 'characters'}
            </VisuallyHidden>
            <Text
              aria-hidden="true"
              id={characterCountId}
              size="small"
              className={clsx(classes.CharacterCounter, isOverLimit && classes['CharacterCounter--error'])}
            >
              {isOverLimit && <AlertFillIcon size={16} />}
              {counter?.message}
            </Text>
          </>
        )}
      </>
    )
  },
)

Textarea.displayName = 'Textarea'
;(Textarea as WithSlotMarker<typeof Textarea>).__SLOT__ = Symbol('Textarea')

export default Textarea as WithSlotMarker<typeof Textarea>
