import {createContext, useContext} from 'react'
import {FormValidationStatus} from '../utils/types/FormValidationStatus'
import {FormControlProps} from './FormControl'

export interface FormControlContext extends Pick<FormControlProps, 'disabled' | 'id' | 'required'> {
  captionId?: string
  validationMessageId?: string
  validationStatus?: FormValidationStatus
}

export const FormControlContext = createContext<FormControlContext | null>(null)

interface FormControlForwardedProps extends Omit<FormControlContext, 'captionId' | 'validationMessageId'> {
  ['aria-describedby']?: string
}

/**
 * Make any component compatible with `FormControl`'s automatic wiring up of accessibility attributes & validation by
 * reading the props from this hook and handling them / assigning them to the underlying form control. If used outside
 * of `FormControl`, this hook has no effect.
 *
 * @param externalProps The external props passed to this component. If provided, these props will be merged with the
 * `FormControl` props, with external props taking priority. This is also used for validating the external props,
 * logging warnings to the console if there are conflicts.
 */
export function useFormControlForwardedProps<P extends FormControlForwardedProps>(externalProps: P): P {
  const context = useContext(FormControlContext)
  if (!context) return externalProps

  if (externalProps.id) {
    // eslint-disable-next-line no-console
    console.warn(
      `instead of passing the 'id' prop directly to the input component, it should be passed to the parent component, <FormControl>`,
    )
  }

  if (externalProps.disabled) {
    // eslint-disable-next-line no-console
    console.warn(
      `instead of passing the 'disabled' prop directly to the input component, it should be passed to the parent component, <FormControl>`,
    )
  }

  if (externalProps.required) {
    // eslint-disable-next-line no-console
    console.warn(
      `instead of passing the 'required' prop directly to the input component, it should be passed to the parent component, <FormControl>`,
    )
  }

  return {
    disabled: context.disabled,
    id: context.id,
    required: context.required,
    validationStatus: context.validationStatus,
    ['aria-describedby']: [context.validationMessageId, context.captionId].filter(Boolean).join(' '),
    ...externalProps,
  }
}
