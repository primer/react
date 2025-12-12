import type {TextareaHTMLAttributes, ReactElement} from 'react'
import React, {useEffect, useRef, useCallback, useId} from 'react'
import {TextInputBaseWrapper} from '../internal/components/TextInputWrapper'
import type {FormValidationStatus} from '../utils/types/FormValidationStatus'
import classes from './TextArea.module.css'
import type {WithSlotMarker} from '../utils/types'
import {CharacterCounter} from '../utils/character-counter'
import VisuallyHidden from '../_VisuallyHidden'
import InputValidation from '../internal/components/InputValidation'
import Text from '../Text'

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
    // Character counter state
    const [characterCount, setCharacterCount] = React.useState<string>('')
    const [isOverLimit, setIsOverLimit] = React.useState<boolean>(false)
    const [validationMessage, setValidationMessage] = React.useState<string>('')
    const [screenReaderMessage, setScreenReaderMessage] = React.useState<string>('')
    const characterCounterRef = useRef<CharacterCounter | null>(null)

    const characterCountId = useId()
    const characterCountLiveRegionId = useId()
    const characterLimitValidationId = useId()

    // Initialize character counter
    useEffect(() => {
      if (characterLimit) {
        characterCounterRef.current = new CharacterCounter({
          onCountUpdate: (count, overLimit, message) => {
            setCharacterCount(message)
            setIsOverLimit(overLimit)
          },
          onValidationChange: (isInvalid, message) => {
            setValidationMessage(message)
          },
          onScreenReaderAnnounce: message => {
            setScreenReaderMessage(message)
          },
        })
        const initialValue =
          value !== undefined ? String(value) : defaultValue !== undefined ? String(defaultValue) : ''
        characterCounterRef.current.updateCharacterCount(initialValue.length, characterLimit)

        return () => {
          characterCounterRef.current?.cleanup()
        }
      }
    }, [characterLimit, value, defaultValue])

    // Update character count when value changes
    useEffect(() => {
      if (characterLimit && characterCounterRef.current) {
        const currentValue = value !== undefined ? String(value) : ''
        characterCounterRef.current.updateCharacterCount(currentValue.length, characterLimit)
      }
    }, [value, characterLimit])

    // Handle textarea change with character counter
    const handleTextareaChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (characterLimit && characterCounterRef.current) {
          characterCounterRef.current.updateCharacterCount(e.target.value.length, characterLimit)
        }
        onChange?.(e)
      },
      [onChange, characterLimit],
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
          />
        </TextInputBaseWrapper>
        {characterLimit && (
          <>
            <VisuallyHidden id={characterCountLiveRegionId} aria-live="polite" aria-atomic="true">
              {screenReaderMessage}
            </VisuallyHidden>
            {isOverLimit && validationMessage && (
              <InputValidation id={characterLimitValidationId} validationStatus="error">
                {validationMessage}
              </InputValidation>
            )}
            <Text
              id={characterCountId}
              size="small"
              style={{
                color: 'var(--fgColor-muted, var(--color-fg-muted))',
              }}
            >
              {characterCount}
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
