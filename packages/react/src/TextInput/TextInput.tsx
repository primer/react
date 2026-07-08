import type {MouseEventHandler} from 'react'
import React, {useCallback, useState, useId} from 'react'
import {isValidElementType} from 'react-is'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {clsx} from 'clsx'
import {AlertFillIcon} from '@primer/octicons-react'

import classes from './TextInput.module.css'
import TextInputInnerVisualSlot from '../internal/components/TextInputInnerVisualSlot'
import {useProvidedRefOrCreate} from '../hooks'
import type {Merge} from '../utils/types'
import type {StyledWrapperProps} from '../internal/components/TextInputWrapper'
import TextInputWrapper from '../internal/components/TextInputWrapper'
import TextInputAction from '../internal/components/TextInputInnerAction'
import UnstyledTextInput from '../internal/components/UnstyledTextInput'
import VisuallyHidden from '../_VisuallyHidden'
import visuallyHiddenClasses from '../_VisuallyHidden.module.css'
import {getCharacterCountState, SCREEN_READER_DELAY} from '../utils/character-counter'
import {AriaStatus} from '../live-region'
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
  /**
   * Stable identifier for the underlying input element.
   *
   * TODO: next-major: Remove in favor of data-component="TextInput.Input"
   */
  'data-component'?: string
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
      'data-component': dataComponent,
      ...inputProps
    },
    ref,
  ) => {
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false)
    const inputRef = useProvidedRefOrCreate(ref as React.RefObject<HTMLInputElement | null>)

    // For uncontrolled usage we track the length of the input's content so the
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

    const inputDescriptionIds = [inputProps['aria-describedby']]
    if (LeadingVisual) {
      inputDescriptionIds.push(leadingVisualId)
    }
    if (TrailingVisual) {
      inputDescriptionIds.push(trailingVisualId)
    }
    if (loading) {
      inputDescriptionIds.push(loadingId)
    }
    const inputDescribedBy = inputDescriptionIds.filter(Boolean).join(' ') || undefined

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

    // Handle input change with character counter
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (characterLimit && !isControlled) {
          setUncontrolledLength(e.target.value.length)
        }
        onChange?.(e)
      },
      [onChange, characterLimit, isControlled],
    )

    const characterCountId = useId()
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
          {IconComponent && <IconComponent className="TextInput-icon" data-component="TextInput.Icon" />}
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
                ? [characterCountStaticMessageId, inputDescribedBy].filter(Boolean).join(' ') || undefined
                : inputDescribedBy
            }
            // TODO: next-major: Remove in favor of data-component="TextInput.Input"
            data-component={dataComponent ?? 'input'}
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
            {/* The remaining-count message is derived in render and announced
                (debounced) by AriaStatus via a shared live region, so it never
                triggers an extra React commit while typing. */}
            <AriaStatus
              announceOnShow={false}
              delayMs={SCREEN_READER_DELAY}
              className={visuallyHiddenClasses.InternalVisuallyHidden}
            >
              {counter?.message}
            </AriaStatus>
            <VisuallyHidden id={characterCountStaticMessageId}>
              You can enter up to {characterLimit} {characterLimit === 1 ? 'character' : 'characters'}
            </VisuallyHidden>
            <Text
              aria-hidden="true"
              id={characterCountId}
              size="small"
              className={clsx(classes.CharacterCounter, isOverLimit && classes['CharacterCounter--error'])}
              data-component="TextInput.CharacterCounter"
            >
              {isOverLimit && <AlertFillIcon size={16} />}
              {counter?.message}
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
