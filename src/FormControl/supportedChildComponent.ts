import {ReactElement, isValidElement} from 'react'
import {FormValidationStatus} from '../utils/types/FormValidationStatus'

/**
 * The presence of this symbol on a component indicates that it supports `FormControl``s auto-wiring features by
 * forwarding the props in `FormControlAutowireComponentProps` to an underlying form element or component. This is
 * useful when wrapping/extending Primer form controls.
 */
export const forwardsProps = Symbol('FormControl.forwardsProps')

/**
 * When a supported component is used as a child of `FormControl`, it will be cloned and these props will be
 * overidden to auto-wire accessibility features. These props should be forwarded to the underlying form control,
 * typically a Primer component.
 */
export interface FormControlForwardedProps {
  /** hello */
  id?: string
  required?: boolean
  disabled?: boolean
  ['aria-describedby']?: string
  validationStatus?: FormValidationStatus
}

export interface FormControlSupportedChild extends ReactElement<FormControlForwardedProps> {
  /**
   * Indicates that this component supports `FormControl` auto-wiring features by forwarding the props in
   * `FormControlAutowireComponentProps` to an underlying form element or component.
   */
  [forwardsProps]: true
}

export function isFormControlSupportedChild(
  object: Parameters<typeof isValidElement>[0],
): object is FormControlSupportedChild {
  return isValidElement(object) && Object.getOwnPropertySymbols(object).includes(forwardsProps)
}
