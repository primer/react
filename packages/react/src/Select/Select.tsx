import React from 'react'
import {clsx} from 'clsx'
import type {StyledWrapperProps} from '../internal/components/TextInputWrapper'
import TextInputWrapper from '../internal/components/TextInputWrapper'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

import classes from './Select.module.css'

export type SelectProps = Omit<
  Omit<React.ComponentProps<'select'>, 'size'> & Omit<StyledWrapperProps, 'variant'>,
  'multiple' | 'hasLeadingVisual' | 'hasTrailingVisual' | 'as'
> & {
  placeholder?: string
}

const ArrowIndicatorSVG: React.FC<React.PropsWithChildren<{className?: string}>> = ({className}) => {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="m4.074 9.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.043 9H4.251a.25.25 0 0 0-.177.427ZM4.074 7.47 7.47 4.073a.25.25 0 0 1 .354 0L11.22 7.47a.25.25 0 0 1-.177.426H4.251a.25.25 0 0 1-.177-.426Z" />
    </svg>
  )
}

const ArrowIndicator: React.FC<{className?: string}> = ({className}) => {
  return <ArrowIndicatorSVG className={clsx(classes.ArrowIndicator, className)} />
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      block,
      children,
      className,
      contrast,
      defaultValue,
      disabled,
      placeholder,
      size,
      required,
      validationStatus,
      ...rest
    }: SelectProps,
    ref,
  ) => {
    return (
      <TextInputWrapper
        block={block}
        contrast={contrast}
        disabled={disabled}
        size={size}
        validationStatus={validationStatus}
        className={clsx(classes.TextInputWrapper, className)}
      >
        <select
          {...rest}
          ref={ref}
          required={required}
          disabled={disabled}
          aria-invalid={validationStatus === 'error' ? 'true' : 'false'}
          className={clsx(classes.Select, disabled && classes.Disabled)}
          data-hasplaceholder={Boolean(placeholder)}
          defaultValue={defaultValue ?? placeholder ?? undefined}
        >
          {placeholder && (
            <option value="" disabled={required} hidden={required}>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <ArrowIndicator className={classes.ArrowIndicator} />
      </TextInputWrapper>
    )
  },
) as PolymorphicForwardRefComponent<'select', SelectProps>

const Option: React.FC<React.PropsWithChildren<React.HTMLProps<HTMLOptionElement> & {value: string}>> = props => (
  <option {...props} />
)

const OptGroup: React.FC<React.PropsWithChildren<React.HTMLProps<HTMLOptGroupElement>>> = props => (
  <optgroup {...props} />
)

export default Object.assign(Select, {
  Option,
  OptGroup,
})
