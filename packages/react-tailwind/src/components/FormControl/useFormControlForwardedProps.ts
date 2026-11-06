'use client'

import type {Field} from '@base-ui/react/field'
import React from 'react'

type FormControlForwardedProps = Pick<Field.Root.Props, 'disabled' | 'name'> & {
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  'aria-labelledby'?: string
  id?: string
  required?: boolean
}

const FormControlContext = React.createContext<FormControlForwardedProps | null>(null)
const FormControlValidationStatusContext = React.createContext<'error' | 'success' | undefined>(undefined)

export const FormControlContextProvider = FormControlContext.Provider
export const FormControlValidationStatusProvider = FormControlValidationStatusContext.Provider
export const useFormControlContext = () => React.useContext(FormControlContext)

/**
 * Returns the variant of the surrounding field's `FormControl.Validation`, so a control can show the same status.
 * A control can request its own status, but an invalid field remains an error.
 */
export const useFormControlValidationStatus = () => React.useContext(FormControlValidationStatusContext)

/**
 * Applies form-level Base UI Field props to a custom control.
 * Props supplied directly to the control take precedence.
 */
export function useFormControlForwardedProps<Props extends object>(
  externalProps: Props,
): Props & FormControlForwardedProps {
  const context = React.useContext(FormControlContext)

  if (!context) return externalProps

  return {...context, ...externalProps}
}
