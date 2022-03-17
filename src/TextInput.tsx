import {ForwardRefComponent as PolymorphicForwardRefComponent} from '@radix-ui/react-polymorphic'
import classnames from 'classnames'
import React from 'react'
import {Merge} from './utils/types'
import TextInputWrapper, {StyledWrapperProps} from './_TextInputWrapper'
import UnstyledTextInput from './_UnstyledTextInput'

type NonPassthroughProps = {
  /** @deprecated Use `leadingVisual` or `trailingVisual` prop instead */
  icon?: React.ComponentType<{className?: string}>
  leadingVisual?: string | React.ComponentType<{className?: string}>
  trailingVisual?: string | React.ComponentType<{className?: string}>
} & Pick<
  StyledWrapperProps,
  | 'block'
  | 'contrast'
  | 'disabled'
  | 'monospace'
  | 'sx'
  | 'width'
  | 'maxWidth'
  | 'minWidth'
  | 'variant'
  | 'size'
  | 'validationStatus'
>

export type TextInputProps = Merge<React.ComponentPropsWithoutRef<'input'>, NonPassthroughProps>

// using forwardRef is important so that other components (ex. SelectMenu) can autofocus the input
const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      icon: IconComponent,
      leadingVisual: LeadingVisual,
      trailingVisual: TrailingVisual,
      block,
      className,
      contrast,
      disabled,
      monospace,
      validationStatus,
      sx: sxProp,
      size: sizeProp,
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
    // this class is necessary to style FilterSearch, plz no touchy!
    const wrapperClasses = classnames(className, 'TextInput-wrapper')

    return (
      <TextInputWrapper
        block={block}
        className={wrapperClasses}
        validationStatus={validationStatus}
        contrast={contrast}
        disabled={disabled}
        monospace={monospace}
        sx={sxProp}
        size={sizeProp}
        width={widthProp}
        minWidth={minWidthProp}
        maxWidth={maxWidthProp}
        variant={variantProp}
        hasLeadingVisual={Boolean(LeadingVisual)}
        hasTrailingVisual={Boolean(TrailingVisual)}
      >
        {IconComponent && <IconComponent className="TextInput-icon" />}
        {LeadingVisual && (
          <span className="TextInput-icon">
            {typeof LeadingVisual === 'function' ? <LeadingVisual /> : LeadingVisual}
          </span>
        )}
        <UnstyledTextInput ref={ref} disabled={disabled} {...inputProps} data-component="input" />
        {TrailingVisual && (
          <span className="TextInput-icon">
            {typeof TrailingVisual === 'function' ? <TrailingVisual /> : TrailingVisual}
          </span>
        )}
      </TextInputWrapper>
    )
  }
) as PolymorphicForwardRefComponent<'input', TextInputProps>

TextInput.defaultProps = {
  type: 'text'
}

TextInput.displayName = 'TextInput'

export default TextInput
