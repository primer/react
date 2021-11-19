import styled from 'styled-components'
import React, {InputHTMLAttributes, ReactElement, useLayoutEffect, useRef} from 'react'
import sx, {SxProp} from './sx'
import {COMMON} from './constants'

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
} & InputHTMLAttributes<HTMLInputElement> &
  SxProp

const StyledCheckbox = styled.input`
  cursor: pointer;

  ${props => props.disabled && `cursor: not-allowed;`}

  ${COMMON};
  ${sx}
`

/**
 * An accessible, native checkbox component
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({checked, indeterminate, disabled, sx: sxProp, ...rest}: CheckboxProps, ref): ReactElement => {
    const checkboxRef = useRef<HTMLInputElement>(null)

    useLayoutEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = indeterminate || false
      }
    }, [indeterminate, checked])

    return (
      <StyledCheckbox
        type="checkbox"
        disabled={disabled}
        aria-disabled={disabled ? 'true' : 'false'}
        ref={ref || checkboxRef}
        checked={indeterminate ? false : checked}
        aria-checked={indeterminate ? 'mixed' : checked ? 'true' : 'false'}
        sx={{...sxProp}}
        {...rest}
      />
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
