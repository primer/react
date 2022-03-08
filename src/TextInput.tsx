import classnames from 'classnames'
import React, {HTMLProps, MouseEventHandler, useState, useCallback} from 'react'
import {ComponentProps, Merge} from './utils/types'
import UnstyledTextInput from './_UnstyledTextInput'
import TextInputWrapper from './_TextInputWrapper'
import TextInputInnerVisualSlot from './_TextInputInnerVisualSlot'
import {useProvidedRefOrCreate} from './hooks'
import TextInputAction from './_TextInputInnerAction'

export type TextInputNonPassthroughProps = {
  className?: string
  /** @deprecated Use `leadingVisual` or `trailingVisual` prop instead */
  icon?: React.ComponentType<{className?: string}>
  /** Whether the to show a loading indicator in the input */
  isLoading?: boolean
  /**
   * Which position to render the loading indicator
   * 'auto' (default): at the end of the input, unless a `leadingVisual` is passed. Then, it will render at the beginning
   * 'leading': at the beginning of the input
   * 'trailing': at the end of the input
   **/
  loaderPosition?: 'auto' | 'leading' | 'trailing'
  /**
   * A visual that renders inside the input before the typing area
   */
  leadingVisual?: string | React.ComponentType<{className?: string}>
  /**
   * A visual that renders inside the input after the typing area
   */
  trailingVisual?: string | React.ComponentType<{className?: string}>
  /**
   * A visual that renders inside the input after the typing area
   */
  trailingAction?: React.ReactElement<HTMLProps<HTMLButtonElement>>
  // trailingAction?: React.ComponentType<{className?: string; onClick: MouseEventHandler}>
} & Pick<
  ComponentProps<typeof TextInputWrapper>,
  'block' | 'contrast' | 'disabled' | 'sx' | 'width' | 'maxWidth' | 'minWidth' | 'variant' | 'size'
>

// Note: using ComponentProps instead of ComponentPropsWithoutRef here would cause a type issue where `css` is a required prop.
type TextInputInternalProps = Merge<
  React.ComponentPropsWithoutRef<typeof UnstyledTextInput>,
  TextInputNonPassthroughProps
>

// using forwardRef is important so that other components (ex. SelectMenu) can autofocus the input
const TextInput = React.forwardRef<HTMLInputElement, TextInputInternalProps>(
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
      isLoading,
      loaderPosition,
      validationStatus,
      sx: sxProp,
      size: sizeProp,
      onFocus,
      onBlur,
      // start deprecated props
      width: widthProp,
      minWidth: minWidthProp,
      maxWidth: maxWidthProp,
      variant: variantProp,
      // end deprecated props
      ...inputProps
    },
    ref
  ) => {
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false)
    const inputRef = useProvidedRefOrCreate(ref as React.RefObject<HTMLInputElement>)
    // this class is necessary to style FilterSearch, plz no touchy!
    const wrapperClasses = classnames(className, 'TextInput-wrapper')
    const showLeadingLoadingIndicator =
      isLoading && (loaderPosition === 'leading' || Boolean(LeadingVisual && loaderPosition !== 'trailing'))
    const showTrailingLoadingIndicator =
      isLoading && (loaderPosition === 'trailing' || Boolean(loaderPosition === 'auto' && !LeadingVisual))
    const focusInput: MouseEventHandler = () => {
      inputRef.current?.focus()
    }
    const handleInputFocus = useCallback(
      e => {
        setIsInputFocused(true)
        onFocus && onFocus(e)
      },
      [onFocus]
    )
    const handleInputBlur = useCallback(
      e => {
        setIsInputFocused(false)
        onBlur && onBlur(e)
      },
      [onBlur]
    )

    return (
      <TextInputWrapper
        block={block}
        className={wrapperClasses}
        validationStatus={validationStatus}
        contrast={contrast}
        disabled={disabled}
        sx={sxProp}
        size={sizeProp}
        width={widthProp}
        minWidth={minWidthProp}
        maxWidth={maxWidthProp}
        variant={variantProp}
        hasLeadingVisual={Boolean(LeadingVisual || showLeadingLoadingIndicator)}
        hasTrailingVisual={Boolean(TrailingVisual || showTrailingLoadingIndicator)}
        hasActions={Boolean(trailingAction)}
        isInputFocused={isInputFocused}
        onClick={focusInput}
      >
        {IconComponent && <IconComponent className="TextInput-icon" />}
        <TextInputInnerVisualSlot
          visualPosition="leading"
          showLoadingIndicator={showLeadingLoadingIndicator}
          hasLoadingIndicator={typeof isLoading === 'boolean'}
        >
          {typeof LeadingVisual === 'function' ? <LeadingVisual /> : LeadingVisual}
        </TextInputInnerVisualSlot>
        <UnstyledTextInput
          ref={inputRef}
          disabled={disabled}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          {...inputProps}
          data-component="input"
        />
        <TextInputInnerVisualSlot
          visualPosition="trailing"
          showLoadingIndicator={showTrailingLoadingIndicator}
          hasLoadingIndicator={typeof isLoading === 'boolean'}
        >
          {typeof TrailingVisual === 'function' ? <TrailingVisual /> : TrailingVisual}
        </TextInputInnerVisualSlot>
        {trailingAction}
      </TextInputWrapper>
    )
  }
)

TextInput.defaultProps = {
  type: 'text',
  loaderPosition: 'auto'
}

TextInput.displayName = 'TextInput'

export type TextInputProps = ComponentProps<typeof TextInput>

export default Object.assign(TextInput, {
  Action: TextInputAction
})
