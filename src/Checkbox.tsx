import styled from 'styled-components'
import React, {InputHTMLAttributes, ReactElement, useLayoutEffect, useRef} from 'react'
import sx, {SxProp} from './sx'
import {COMMON} from './constants'

export type CheckboxProps = {
  /**
   * Apply indeterminate state for the checkbox
   */
  indeterminate?: boolean

  disabled?: boolean

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
 * An accessible checkbox
 * @param param0 A
 * @returns
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
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
        ref={ref || checkboxRef}
        checked={checked}
        aria-checked={indeterminate ? 'mixed' : checked}
        sx={{...sxProp}}
        {...rest}
      />
    )
  }
)
