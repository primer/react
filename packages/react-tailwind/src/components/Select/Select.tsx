'use client'

import React from 'react'
import {cn} from '../../internal/cn'
import {markFormControlInput} from '../../internal/formControlParts'
import type {ControlSize} from '../../utils/types'
import {useFormControlForwardedProps, useFormControlValidationStatus} from '../FormControl/useFormControlForwardedProps'

type ValidationStatus = 'error' | 'success'

const selectWrapperClassName =
  'primer:relative primer:inline-flex primer:h-8 primer:w-auto primer:overflow-hidden primer:align-middle primer:rounded-md primer:border-thin primer:border-[var(--control-borderColor-rest)] primer:bg-default primer:text-sm primer:leading-5 primer:text-default primer:shadow-[var(--shadow-inset)] primer:focus-within:border-accent-emphasis primer:focus-within:outline-2 primer:focus-within:outline-offset-[-1px] primer:focus-within:outline-[var(--borderColor-accent-emphasis)] primer:data-[block]:flex primer:data-[block]:w-full primer:data-[block]:self-stretch primer:data-[disabled]:border-[var(--control-borderColor-disabled)] primer:data-[disabled]:bg-[var(--control-bgColor-disabled)] primer:data-[disabled]:text-disabled primer:data-[disabled]:shadow-none primer:data-[multiple]:h-auto primer:data-[multiple]:min-h-8 primer:data-[multiple]:overflow-visible primer:data-[validation=error]:border-danger-emphasis primer:data-[validation=error]:focus-within:border-[var(--control-borderColor-danger)] primer:data-[validation=error]:focus-within:outline-[var(--control-borderColor-danger)] primer:data-[validation=success]:border-[var(--bgColor-success-emphasis)] primer:data-[size=small]:h-7 primer:data-[size=large]:h-10 primer:data-[size=small]:text-xs'

const selectClassName =
  'primer:my-px primer:ml-px primer:w-full primer:min-w-0 primer:cursor-pointer primer:appearance-none primer:rounded-[inherit] primer:border-0 primer:bg-inherit primer:px-3 primer:[font-size:inherit] primer:text-inherit primer:outline-none primer:not-last:mr-2 primer:disabled:cursor-not-allowed primer:disabled:bg-transparent'

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'data-component' | 'size'> {
  /** Makes the visible control fill its container. */
  block?: boolean
  /** Text rendered as an initially selected empty-value option. */
  placeholder?: string
  /** Primer control height and typography. */
  size?: ControlSize
  /** Applies error or success control styling. */
  validationStatus?: ValidationStatus
  /** Classes applied to the visible control wrapper. */
  className?: string
}

export type SelectOptionProps = Omit<React.OptionHTMLAttributes<HTMLOptionElement>, 'data-component'> & {
  /** Value submitted when this option is chosen. */
  value: string
}

const Option = ({children, ...rest}: SelectOptionProps) => (
  <option {...rest} data-component="Select.Option">
    {children}
  </option>
)

export type SelectOptGroupProps = Omit<React.OptgroupHTMLAttributes<HTMLOptGroupElement>, 'data-component'>

const OptGroup = ({children, ...rest}: SelectOptGroupProps) => (
  <optgroup {...rest} data-component="Select.OptGroup">
    {children}
  </optgroup>
)

/**
 * A styled native select. It preserves browser keyboard, focus, form, and option semantics.
 * Compose native `option` and `optgroup` children directly, or use `Select.Option` and `Select.OptGroup`.
 */
const SelectRoot = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    block = false,
    children,
    className,
    defaultValue,
    disabled,
    multiple,
    placeholder,
    size,
    validationStatus,
    value,
    ...rest
  },
  ref,
) {
  const forwardedProps = useFormControlForwardedProps(rest)
  const fieldValidationStatus = useFormControlValidationStatus()
  const effectiveValidation = forwardedProps['aria-invalid'] ? 'error' : (validationStatus ?? fieldValidationStatus)
  const ariaInvalid = effectiveValidation === 'error' ? true : forwardedProps['aria-invalid']
  const isDisabled = disabled ?? forwardedProps.disabled
  const hasPlaceholder = Boolean(placeholder && !multiple)

  return (
    <span
      className={cn(selectWrapperClassName, className)}
      data-block={block || undefined}
      data-disabled={isDisabled || undefined}
      data-multiple={multiple || undefined}
      data-size={size}
      data-validation={effectiveValidation}
    >
      <select
        {...forwardedProps}
        ref={ref}
        aria-invalid={ariaInvalid}
        className={selectClassName}
        data-component="Select"
        data-has-placeholder={hasPlaceholder ? '' : undefined}
        defaultValue={value === undefined ? (defaultValue ?? (hasPlaceholder ? '' : undefined)) : undefined}
        disabled={isDisabled}
        multiple={multiple}
        value={value}
      >
        {hasPlaceholder ? (
          <option
            disabled={forwardedProps.required}
            hidden={forwardedProps.required}
            value=""
            data-component="Select.Option"
          >
            {placeholder}
          </option>
        ) : null}
        {children}
      </select>
      {!multiple ? (
        <svg
          aria-hidden="true"
          className="primer:pointer-events-none primer:absolute primer:top-1/2 primer:right-1 primer:size-4 primer:-translate-y-1/2"
          fill="currentColor"
          height="16"
          viewBox="0 0 16 16"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m4.074 9.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.043 9H4.251a.25.25 0 0 0-.177.427ZM4.074 7.47 7.47 4.073a.25.25 0 0 1 .354 0L11.22 7.47a.25.25 0 0 1-.177.426H4.251a.25.25 0 0 1-.177-.426Z" />
        </svg>
      ) : null}
    </span>
  )
})

SelectRoot.displayName = 'Select'

export const Select = Object.assign(SelectRoot, {Option, OptGroup})

markFormControlInput(Select)

export default Select
