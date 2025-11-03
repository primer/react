import type {MouseEventHandler} from 'react'
import React, {useCallback, useState, useId} from 'react'
import {isValidElementType} from 'react-is'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {clsx} from 'clsx'

import TextInputInnerVisualSlot from '../internal/components/TextInputInnerVisualSlot'
import {useProvidedRefOrCreate} from '../hooks'
import type {Merge} from '../utils/types'
import type {StyledWrapperProps} from '../internal/components/TextInputWrapper'
import TextInputWrapper from '../internal/components/TextInputWrapper'
import TextInputAction from '../internal/components/TextInputInnerAction'
import UnstyledTextInput from '../internal/components/UnstyledTextInput'
import VisuallyHidden from '../_VisuallyHidden'

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
      ...inputProps
    },
    ref,
  ) => {
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false)
    const inputRef = useProvidedRefOrCreate(ref as React.RefObject<HTMLInputElement>)
    // this class is necessary to style FilterSearch, plz no touchy!
    const wrapperClasses = clsx(className, 'TextInput-wrapper')
    const showLeadingLoadingIndicator =
      loading && (loaderPosition === 'leading' || Boolean(LeadingVisual && loaderPosition !== 'trailing'))
    const showTrailingLoadingIndicator =
      loading && (loaderPosition === 'trailing' || Boolean(loaderPosition === 'auto' && !LeadingVisual))
    const focusInput: MouseEventHandler = () => {
      inputRef.current?.focus()
    }
    const leadingVisualId = useId()
    const trailingVisualId = useId()
    const loadingId = useId()

    const inputDescribedBy =
      clsx(
        inputProps['aria-describedby'],
        LeadingVisual && leadingVisualId,
        TrailingVisual && trailingVisualId,
        loading && loadingId,
      ) || undefined

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

    return (
      <TextInputWrapper
        block={block}
        className={wrapperClasses}
        validationStatus={validationStatus}
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
          ref={inputRef}
          disabled={disabled}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          type={type}
          aria-required={required}
          aria-invalid={validationStatus === 'error' ? 'true' : undefined}
          {...inputProps}
          aria-describedby={inputDescribedBy}
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
    )
  },
) as PolymorphicForwardRefComponent<'input', TextInputProps>

TextInput.displayName = 'TextInput'

export default Object.assign(TextInput, {
  __SLOT__: Symbol('TextInput'),
  Action: TextInputAction,
})
