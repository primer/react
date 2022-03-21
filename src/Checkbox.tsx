import styled from 'styled-components'
import {useProvidedRefOrCreate} from './hooks'
import React, {ChangeEventHandler, InputHTMLAttributes, ReactElement, useContext, useLayoutEffect} from 'react'
import sx, {SxProp} from './sx'
import {FormValidationStatus} from './utils/types/FormValidationStatus'
import {CheckboxGroupContext} from './CheckboxGroup'

export type CheckboxProps = {
  /**
   * Apply indeterminate visual appearance to the checkbox
   */
  indeterminate?: boolean
  /**
   * Apply inactive visual appearance to the checkbox
   */
  disabled?: boolean
  /**
   * Forward a ref to the underlying input element
   */
  ref?: React.RefObject<HTMLInputElement>
  /**
   * Indicates whether the checkbox must be checked
   */
  required?: boolean
  /**
   * Indicates whether the checkbox validation state
   */
  validationStatus?: FormValidationStatus
  /**
   * A unique value that is never shown to the user.
   * Used during form submission and to identify which checkbox inputs are selected
   */
  value?: string
} & Exclude<InputHTMLAttributes<HTMLInputElement>, 'value'> &
  SxProp

const StyledCheckbox = styled.input`
  cursor: pointer;

  ${props => props.disabled && `cursor: not-allowed;`}

  ${sx}
`

/**
 * An accessible, native checkbox component
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {checked, indeterminate, disabled, onChange, sx: sxProp, required, validationStatus, value, ...rest}: CheckboxProps,
    ref
  ): ReactElement => {
    const checkboxRef = useProvidedRefOrCreate(ref as React.RefObject<HTMLInputElement>)
    const checkboxGroupContext = useContext(CheckboxGroupContext)
    const handleOnChange: ChangeEventHandler<HTMLInputElement> = e => {
      checkboxGroupContext.onChange && checkboxGroupContext.onChange(e)
      onChange && onChange(e)
    }

    useLayoutEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = indeterminate || false
      }
    }, [indeterminate, checked, checkboxRef])

    return (
      <StyledCheckbox
        type="checkbox"
        disabled={disabled}
        aria-disabled={disabled ? 'true' : 'false'}
        ref={ref || checkboxRef}
        checked={indeterminate ? false : checked}
        aria-checked={indeterminate ? 'mixed' : checked ? 'true' : 'false'}
        sx={sxProp}
        required={required}
        aria-required={required ? 'true' : 'false'}
        aria-invalid={validationStatus === 'error' ? 'true' : 'false'}
        onChange={handleOnChange}
        value={value}
        name={value}
        {...rest}
      />
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
