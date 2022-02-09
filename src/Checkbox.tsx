import styled from 'styled-components'
import {useProvidedRefOrCreate} from './hooks'
import React, {InputHTMLAttributes, ReactElement, useLayoutEffect} from 'react'
import sx, {SxProp} from './sx'
import {FormValidationStatus} from './utils/types/FormValidationStatus'

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
} & InputHTMLAttributes<HTMLInputElement> &
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
    {checked, indeterminate, disabled, sx: sxProp, required, validationStatus, ...rest}: CheckboxProps,
    ref
  ): ReactElement => {
    const checkboxRef = useProvidedRefOrCreate(ref as React.RefObject<HTMLInputElement>)

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
        {...rest}
      />
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
