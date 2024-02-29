import {createContext, useContext} from 'react'
import type {FormValidationStatus} from '../utils/types/FormValidationStatus'
import type {FormControlProps} from './FormControl'

interface FormControlContext extends Pick<FormControlProps, 'disabled' | 'id' | 'required'> {
  captionId?: string
  validationMessageId?: string
  validationStatus?: FormValidationStatus
}

const FormControlContext = createContext<FormControlContext | null>(null)

export const FormControlContextProvider = FormControlContext.Provider

/** This is the private/internal interface for subcomponents of `FormControl`. */
export function useFormControlContext(): FormControlContext {
  return useContext(FormControlContext) ?? {}
}

interface FormControlForwardedProps extends Omit<FormControlContext, 'captionId' | 'validationMessageId'> {
  ['aria-describedby']?: string
}

/**
 * Make any component compatible with `FormControl`'s automatic wiring up of accessibility attributes & validation by
 * reading the props from this hook and merging them with the passed-in props. If used outside of `FormControl`, this
 * hook has no effect.
 *
 * @param externalProps The external props passed to this component. If provided, these props will be merged with the
 * `FormControl` props, with external props taking priority.
 */
export function useFormControlForwardedProps<P>(externalProps: P): P & FormControlForwardedProps
/**
 * Make any component compatible with `FormControl`'s automatic wiring up of accessibility attributes & validation by
 * reading the props from this hook and handling them / assigning them to the underlying form control. If used outside
 * of `FormControl`, this hook has no effect.
 */
export function useFormControlForwardedProps(): FormControlForwardedProps
export function useFormControlForwardedProps(externalProps: FormControlForwardedProps = {}) {
  const context = useContext(FormControlContext)
  if (!context) return externalProps

  return {
    disabled: context.disabled,
    id: context.id,
    required: context.required,
    validationStatus: context.validationStatus,
    ['aria-describedby']: [context.validationMessageId, context.captionId].filter(Boolean).join(' ') || undefined,
    ...externalProps,
  }
}
