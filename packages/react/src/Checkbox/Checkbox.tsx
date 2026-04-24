import {clsx} from 'clsx'
import {useMergedRefs} from '../hooks'
import React, {useContext, type ChangeEventHandler, type InputHTMLAttributes, type ReactElement} from 'react'
import type {FormValidationStatus} from '../utils/types/FormValidationStatus'
import {CheckboxGroupContext} from '../CheckboxGroup/CheckboxGroupContext'
import classes from './Checkbox.module.css'
import sharedClasses from './shared.module.css'
import type {WithSlotMarker} from '../utils/types'

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
   * Only used to inform ARIA attributes. Individual checkboxes do not have validation styles.
   */
  validationStatus?: FormValidationStatus
  /**
   * A unique value that is never shown to the user.
   * Used during form submission and to identify which checkbox inputs are selected
   */
  value?: string
} & Exclude<InputHTMLAttributes<HTMLInputElement>, 'value'>

/**
 * An accessible, native checkbox component
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {checked, className, defaultChecked, indeterminate, disabled, onChange, required, validationStatus, value, ...rest},
    ref,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): ReactElement<any> => {
    const setIndeterminate = React.useCallback(
      (node: HTMLInputElement | null) => {
        if (node) {
          node.indeterminate = indeterminate || false
        }
      },
      // `checked` is intentionally included even though it is not used inside
      // the callback: browsers silently clear the `indeterminate` property
      // whenever the checked state changes, so the callback must re-run to
      // restore it. The exhaustive-deps rule flags this as an unnecessary
      // dependency (because `checked` isn't referenced in the body), hence the
      // suppression below.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [indeterminate, checked],
    )
    const mergedRef = useMergedRefs(ref, setIndeterminate)

    const checkboxGroupContext = useContext(CheckboxGroupContext)
    const handleOnChange: ChangeEventHandler<HTMLInputElement> = e => {
      checkboxGroupContext.onChange && checkboxGroupContext.onChange(e)
      onChange && onChange(e)
    }

    // aria-checked must reflect three states: mixed (indeterminate), true, or false.
    const ariaChecked = indeterminate ? ('mixed' as const) : checked ? ('true' as const) : ('false' as const)

    const inputProps = {
      type: 'checkbox',
      disabled,
      ref: mergedRef,
      checked: indeterminate ? false : checked,
      defaultChecked,
      required,
      ['aria-required']: required ? ('true' as const) : ('false' as const),
      ['aria-invalid']: validationStatus === 'error' ? ('true' as const) : ('false' as const),
      ['aria-checked']: ariaChecked,
      onChange: handleOnChange,
      value,
      name: value,
      ...rest,
    }

    return <input {...inputProps} className={clsx(className, sharedClasses.Input, classes.Checkbox)} />
  },
)

Checkbox.displayName = 'Checkbox'
;(Checkbox as WithSlotMarker<typeof Checkbox>).__SLOT__ = Symbol('Checkbox')

export default Checkbox as WithSlotMarker<typeof Checkbox>
