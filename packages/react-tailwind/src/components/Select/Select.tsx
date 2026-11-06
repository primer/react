'use client'

import React from 'react'
import {cn} from '../../internal/cn'
import {markFormControlInput} from '../../internal/formControlParts'
import type {ControlSize} from '../../utils/types'
import {useFormControlForwardedProps, useFormControlValidationStatus} from '../FormControl/useFormControlForwardedProps'

type ValidationStatus = 'error' | 'success'

const selectWrapperClassName =
  'relative inline-flex h-8 w-auto overflow-hidden align-middle rounded-md border border-[var(--control-borderColor-rest)] bg-default text-sm leading-5 text-default shadow-[var(--shadow-inset)] focus-within:border-accent-emphasis focus-within:outline-2 focus-within:outline-offset-[-1px] focus-within:outline-[var(--borderColor-accent-emphasis)] data-[block]:flex data-[block]:w-full data-[block]:self-stretch data-[disabled]:border-[var(--control-borderColor-disabled)] data-[disabled]:bg-[var(--control-bgColor-disabled)] data-[disabled]:text-disabled data-[disabled]:shadow-none data-[multiple]:h-auto data-[multiple]:min-h-8 data-[multiple]:overflow-visible data-[validation=error]:border-danger-emphasis data-[validation=error]:focus-within:border-[var(--control-borderColor-danger)] data-[validation=error]:focus-within:outline-[var(--control-borderColor-danger)] data-[validation=success]:border-[var(--bgColor-success-emphasis)] data-[size=small]:h-7 data-[size=large]:h-10 data-[size=small]:text-xs'

const selectClassName =
  'my-px ml-px w-full min-w-0 cursor-pointer appearance-none rounded-[inherit] border-0 bg-inherit px-3 [font-size:inherit] text-inherit outline-none not-last:mr-2 disabled:cursor-not-allowed disabled:bg-transparent'

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
          className="pointer-events-none absolute top-1/2 right-1 size-4 -translate-y-1/2"
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
