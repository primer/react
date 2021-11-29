import classnames from 'classnames'
import React from 'react'
import {ComponentProps, Merge} from './utils/types'
import UnstyledTextInput from './_UnstyledTextInput'
import TextInputWrapper from './_TextInputWrapper'

type NonPassthroughProps = {
  className?: string
  // deprecate icon prop
  icon?: React.ComponentType<{className?: string}>
  leadingIcon?: React.ComponentType<{className?: string}>
  trailingIcon?: React.ComponentType<{className?: string}>
} & Pick<
  ComponentProps<typeof TextInputWrapper>,
  'block' | 'contrast' | 'disabled' | 'sx' | 'theme' | 'width' | 'maxWidth' | 'minWidth' | 'variant' | 'size'
>

// Note: using ComponentProps instead of ComponentPropsWithoutRef here would cause a type issue where `css` is a required prop.
type TextInputInternalProps = Merge<React.ComponentPropsWithoutRef<typeof UnstyledTextInput>, NonPassthroughProps>

// using forwardRef is important so that other components (ex. SelectMenu) can autofocus the input
const TextInput = React.forwardRef<HTMLInputElement, TextInputInternalProps>(
  (
    {
      icon: IconComponent,
      leadingIcon: LeadingIconComponent,
      trailingIcon: TrailingIconComponent,
      block,
      className,
      contrast,
      disabled,
      status,
      sx: sxProp,
      theme,
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
        status={status}
        contrast={contrast}
        disabled={disabled}
        hasIcon={!!IconComponent || !!(LeadingIconComponent || TrailingIconComponent)}
        sx={sxProp}
        theme={theme}
        width={widthProp}
        minWidth={minWidthProp}
        maxWidth={maxWidthProp}
        variant={variantProp}
      >
        {IconComponent && <IconComponent className="TextInput-leading-icon" />}
        {LeadingIconComponent && <LeadingIconComponent className="TextInput-leading-icon" />}
        <UnstyledTextInput ref={ref} disabled={disabled} {...inputProps} data-component="input" />
        {TrailingIconComponent && <TrailingIconComponent className="TextInput-trailing-icon" />}
      </TextInputWrapper>
    )
  }
)

TextInput.defaultProps = {
  type: 'text'
}

TextInput.displayName = 'TextInput'

export type TextInputProps = ComponentProps<typeof TextInput>
export default TextInput
