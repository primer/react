import type {MouseEventHandler} from 'react'
import React, {useCallback, useState, useId, useEffect, useRef} from 'react'
import {isValidElementType} from 'react-is'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {clsx} from 'clsx'
import {AlertFillIcon} from '@primer/octicons-react'

import TextInputInnerVisualSlot from '../internal/components/TextInputInnerVisualSlot'
import {useProvidedRefOrCreate} from '../hooks'
import type {Merge} from '../utils/types'
import type {StyledWrapperProps} from '../internal/components/TextInputWrapper'
import TextInputWrapper from '../internal/components/TextInputWrapper'
import TextInputAction from '../internal/components/TextInputInnerAction'
import UnstyledTextInput from '../internal/components/UnstyledTextInput'
import VisuallyHidden from '../_VisuallyHidden'
import {CharacterCounter} from '../utils/character-counter'
import Text from '../Text'

export type TextInputNonPassthroughProps = {
  /** @deprecated Use `leadingVisual` or `trailingVisual` prop instead */
  icon?: React.ElementType
  /** Whether the to show a loading indicator in the input */
  loading?: boolean
  /**
   * Which position to render the loading indicator
   * 'auto' (default): at the end of the input, unless a `leadingVisual` is passed. Then, it will render at the beginning
   * 'leading': at the beginning of the input
   * 'trailing': at the end of the input
   **/
  loaderPosition?: 'auto' | 'leading' | 'trailing'
  /** Text for screen readers to convey the loading state */
  loaderText?: string
  /**
   * A visual that renders inside the input before the typing area
   */
  leadingVisual?: React.ElementType | React.ReactNode
  /**
   * A visual that renders inside the input after the typing area
   */
  trailingVisual?: React.ElementType | React.ReactNode
  /**
   * A visual that renders inside the input after the typing area
   */
  trailingAction?: React.ReactElement<React.HTMLProps<HTMLButtonElement>>
  /**
   * Optional character limit for the input. If provided, a character counter will be displayed below the input.
   * When the limit is exceeded, validation styling will be applied.
   */
  characterLimit?: number
} & Partial<
  Pick<
    StyledWrapperProps,
    | 'block'
    | 'contrast'
    | 'disabled'
    | 'monospace'
    | 'width'
    | 'maxWidth'
    | 'minWidth'
    | 'variant'
    | 'size'
    | 'validationStatus'
  >
>

export type TextInputProps = Merge<React.ComponentPropsWithoutRef<'input'>, TextInputNonPassthroughProps>

// using forwardRef is important so that other components can autofocus the input
const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      icon: IconComponent,
      leadingVisual: LeadingVisual,
      trailingVisual: TrailingVisual,
      trailingAction,
      block,
      className,
      contrast,
      disabled,
      loading,
      loaderPosition = 'auto',
      loaderText = 'Loading',
      monospace,
      validationStatus,
      size: sizeProp,
      onFocus,
      onBlur,
      // start deprecated props
      variant: variantProp,
      width: widthProp,
      minWidth: minWidthProp,
      maxWidth: maxWidthProp,
      // end deprecated props
      type = 'text',
      required,
      characterLimit,
      onChange,
      value,
      defaultValue,
      ...inputProps
    },
    ref,
  ) => {
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false)
    const inputRef = useProvidedRefOrCreate(ref as React.RefObject<HTMLInputElement | null>)
    const [characterCount, setCharacterCount] = useState<string>('')
    const [isOverLimit, setIsOverLimit] = useState<boolean>(false)
    const [screenReaderMessage, setScreenReaderMessage] = useState<string>('')
    const characterCounterRef = useRef<CharacterCounter | null>(null)

    // this class is necessary to style FilterSearch, plz no touchy!
    const wrapperClasses = clsx(className, 'TextInput-wrapper')
    const showLeadingLoadingIndicator =
      loading && (loaderPosition === 'leading' || Boolean(LeadingVisual && loaderPosition !== 'trailing'))
    const showTrailingLoadingIndicator =
      loading && (loaderPosition === 'trailing' || Boolean(loaderPosition === 'auto' && !LeadingVisual))

    // Date/time input types that have segment-based focus
    const isSegmentedInputType = type === 'date' || type === 'time' || type === 'datetime-local'

    const focusInput: MouseEventHandler = e => {
      // Don't call focus() if the input itself was clicked on date/time inputs.
      if (e.target !== inputRef.current || !isSegmentedInputType) {
        inputRef.current?.focus()
      }
    }
    const leadingVisualId = useId()
    const trailingVisualId = useId()
    const loadingId = useId()

    const handleInputFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsInputFocused(true)
        onFocus && onFocus(e)
      },
      [onFocus],
    )
    const handleInputBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsInputFocused(false)
        onBlur && onBlur(e)
      },
      [onBlur],
    )

    // Initialize character counter
    useEffect(() => {
      if (characterLimit) {
        characterCounterRef.current = new CharacterCounter({
          onCountUpdate: (count, overLimit, message) => {
            setCharacterCount(message)
            setIsOverLimit(overLimit)
          },
          onScreenReaderAnnounce: message => {
            setScreenReaderMessage(message)
          },
        })

        return () => {
          characterCounterRef.current?.cleanup()
        }
      }
    }, [characterLimit])

    // Update character count when value changes
    useEffect(() => {
      if (characterLimit && characterCounterRef.current) {
        const currentValue = value !== undefined ? String(value) : inputRef.current?.value || ''
        characterCounterRef.current.updateCharacterCount(currentValue.length, characterLimit)
      }
    }, [value, characterLimit, inputRef])

    // Handle input change with character counter
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (characterLimit && characterCounterRef.current) {
          characterCounterRef.current.updateCharacterCount(e.target.value.length, characterLimit)
        }
        onChange?.(e)
      },
      [onChange, characterLimit],
    )

    const characterCountId = useId()
    const characterCountLiveRegionId = useId()
    const characterCountStaticMessageId = useId()

    const isValid = isOverLimit ? 'error' : validationStatus

    return (
      <>
        <TextInputWrapper
          block={block}
          className={wrapperClasses}
          validationStatus={isValid}
          contrast={contrast}
          disabled={disabled}
          monospace={monospace}
          size={sizeProp}
          width={widthProp}
          minWidth={minWidthProp}
          maxWidth={maxWidthProp}
          variant={variantProp}
          hasLeadingVisual={Boolean(LeadingVisual || showLeadingLoadingIndicator)}
          hasTrailingVisual={Boolean(TrailingVisual || showTrailingLoadingIndicator)}
          hasTrailingAction={Boolean(trailingAction)}
          isInputFocused={isInputFocused}
          onClick={focusInput}
          aria-busy={Boolean(loading)}
        >
          {IconComponent && <IconComponent className="TextInput-icon" />}
          <TextInputInnerVisualSlot
            visualPosition="leading"
            showLoadingIndicator={showLeadingLoadingIndicator}
            hasLoadingIndicator={typeof loading === 'boolean'}
            id={leadingVisualId}
          >
            {typeof LeadingVisual !== 'string' && isValidElementType(LeadingVisual) ? <LeadingVisual /> : LeadingVisual}
          </TextInputInnerVisualSlot>
          <UnstyledTextInput
            // @ts-expect-error it needs a non nullable ref
            ref={inputRef}
            disabled={disabled}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            type={type}
            aria-required={required}
            aria-invalid={isValid === 'error' ? 'true' : undefined}
            value={value}
            defaultValue={defaultValue}
            {...inputProps}
            aria-describedby={
              characterLimit
                ? [characterCountStaticMessageId, inputProps['aria-describedby']].filter(Boolean).join(' ') || undefined
                : inputProps['aria-describedby']
            }
            data-component="input"
          />
          {loading && <VisuallyHidden id={loadingId}>{loaderText}</VisuallyHidden>}
          <TextInputInnerVisualSlot
            visualPosition="trailing"
            showLoadingIndicator={showTrailingLoadingIndicator}
            hasLoadingIndicator={typeof loading === 'boolean'}
            id={trailingVisualId}
            data-testid="text-input-trailing-visual"
          >
            {typeof TrailingVisual !== 'string' && isValidElementType(TrailingVisual) ? (
              <TrailingVisual />
            ) : (
              TrailingVisual
            )}
          </TextInputInnerVisualSlot>
          {trailingAction}
        </TextInputWrapper>
        {characterLimit && (
          <>
            <VisuallyHidden id={characterCountLiveRegionId} aria-live="polite" role="status">
              {screenReaderMessage}
            </VisuallyHidden>
            <VisuallyHidden id={characterCountStaticMessageId}>
              You can enter up to {characterLimit} {characterLimit === 1 ? 'character' : 'characters'}
            </VisuallyHidden>
            <Text
              id={characterCountId}
              size="small"
              style={{
                color: isOverLimit
                  ? 'var(--fgColor-danger, var(--color-danger-fg))'
                  : 'var(--fgColor-muted, var(--color-fg-muted))',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--base-size-4, 4px)',
              }}
            >
              {isOverLimit && <AlertFillIcon size={16} />}
              {characterCount}
            </Text>
          </>
        )}
      </>
    )
  },
) as PolymorphicForwardRefComponent<'input', TextInputProps>

TextInput.displayName = 'TextInput'

export default Object.assign(TextInput, {
  __SLOT__: Symbol('TextInput'),
  Action: TextInputAction,
})
