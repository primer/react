'use client'

import type {Field} from '@base-ui/react/field'
import React from 'react'

type FormControlForwardedProps = Pick<Field.Root.Props, 'disabled' | 'name'> & {
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  id?: string
  required?: boolean
}

const FormControlContext = React.createContext<FormControlForwardedProps | null>(null)

export const FormControlContextProvider = FormControlContext.Provider
export const useFormControlContext = () => React.useContext(FormControlContext)

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
;('use client')
