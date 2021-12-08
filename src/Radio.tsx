import styled from 'styled-components'
import React, {InputHTMLAttributes, ReactElement} from 'react'
import sx, {SxProp} from './sx'

export type RadioProps = {
  /**
   * A unique value that is never shown to the user.
   * Used during form submission and to identify which radio button in a group is selected
   */
  value: string
  /**
   * Name attribute of the input element. Required for grouping radio inputs
   */
  name: string
  /**
   * Apply inactive visual appearance to the radio button
   */
  disabled?: boolean
  /**
   * Indicates whether the radio button is selected
   */
  checked?: boolean
  /**
   * Forward a ref to the underlying input element
   */
  ref?: React.RefObject<HTMLInputElement>
  /**
   * Indicates whether the radio button must be checked before the form can be submitted
   */
  required?: boolean
  /**
   * Indicates whether the radio button validation state is non-standard
   */
  validationStatus?: 'error' | 'success' // TODO: hoist to Validation typings
} & InputHTMLAttributes<HTMLInputElement> &
  SxProp

const StyledRadio = styled.input`
  cursor: pointer;

  ${props => props.disabled && `cursor: not-allowed;`}

  ${sx}
`

/**
 * An accessible, native radio component for selecting one option from a list.
 */
const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {checked, disabled, sx: sxProp, required, validationStatus, value, name, ...rest}: RadioProps,
    ref
  ): ReactElement => {
    return (
      <StyledRadio
        type="radio"
        value={value}
        name={name}
        ref={ref}
        disabled={disabled}
        aria-disabled={disabled ? 'true' : 'false'}
        checked={checked}
        aria-checked={checked ? 'true' : 'false'}
        required={required}
        aria-required={required ? 'true' : 'false'}
        aria-invalid={validationStatus === 'error' ? 'true' : 'false'}
        sx={sxProp}
        {...rest}
      />
    )
  }
)

Radio.displayName = 'Radio'

export default Radio
