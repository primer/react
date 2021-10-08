import classnames from 'classnames'
import React from 'react'
import {ComponentProps, Merge} from './utils/types'
import UnstyledTextInput from './_UnstyledTextInput'
import TextInputWrapper from './_TextInputWrapper'

type NonPassthroughProps = {
  className?: string
  icon?: React.ComponentType<{className?: string}>
} & Pick<
  ComponentProps<typeof TextInputWrapper>,
  'block' | 'contrast' | 'disabled' | 'sx' | 'theme' | 'width' | 'maxWidth' | 'minWidth' | 'variant'
>

// Note: using ComponentProps instead of ComponentPropsWithoutRef here would cause a type issue where `css` is a required prop.
type TextInputInternalProps = Merge<React.ComponentPropsWithoutRef<typeof UnstyledTextInput>, NonPassthroughProps>

// using forwardRef is important so that other components (ex. SelectMenu) can autofocus the input
const TextInput = React.forwardRef<HTMLInputElement, TextInputInternalProps>(
  (
    {
      icon: IconComponent,
      block,
      className,
      contrast,
      disabled,
      sx: sxProp,
      theme,
      width: widthProp,
      minWidth: minWidthProp,
      maxWidth: maxWidthProp,
      variant: variantProp,
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
        contrast={contrast}
        disabled={disabled}
        hasIcon={!!IconComponent}
        sx={sxProp}
        theme={theme}
        width={widthProp}
        minWidth={minWidthProp}
        maxWidth={maxWidthProp}
        variant={variantProp}
      >
        {IconComponent && <IconComponent className="TextInput-icon" />}
        <UnstyledTextInput ref={ref} disabled={disabled} {...inputProps} />
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
