import {clsx} from 'clsx'
import {useMergedRefs} from '../hooks'
import React, {
  useCallback,
  useContext,
  useRef,
  type ChangeEventHandler,
  type InputHTMLAttributes,
  type ReactElement,
} from 'react'
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
  'data-component'?: string
} & Exclude<InputHTMLAttributes<HTMLInputElement>, 'value'>

/**
 * An accessible, native checkbox component
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      className,
      defaultChecked,
      indeterminate,
      disabled,
      onChange,
      required,
      validationStatus,
      value,
      ['data-component']: dataComponent,
      ...rest
    },
    ref,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): ReactElement<any> => {
    const checkboxRef = useRef<HTMLInputElement>(null)
    const checkboxGroupContext = useContext(CheckboxGroupContext)
    const handleOnChange: ChangeEventHandler<HTMLInputElement> = e => {
      checkboxGroupContext.onChange && checkboxGroupContext.onChange(e)
      onChange && onChange(e)

      if (indeterminate && checkboxRef.current) {
        checkboxRef.current.indeterminate = true
        checkboxRef.current.setAttribute('aria-checked', 'mixed')
      }
    }

    // Ref callback that runs synchronously during commit (same timing as
    // `useLayoutEffect`) to imperatively set the DOM `.indeterminate` property,
    // which has no HTML attribute equivalent, along with the matching
    // `aria-checked` value. This avoids a layout effect per Checkbox instance.
    const setIndeterminate = useCallback(
      (node: HTMLInputElement | null) => {
        if (node) {
          node.indeterminate = indeterminate || false
          if (indeterminate) {
            node.setAttribute('aria-checked', 'mixed')
          } else {
            node.setAttribute('aria-checked', node.checked ? 'true' : 'false')
          }
        }
      },
      // `checked` is intentionally included: the callback reads `node.checked` (to also
      // cover uncontrolled inputs), so it must re-run to refresh `aria-checked` when the
      // controlled `checked` prop changes. eslint can't see this indirect dependency.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [indeterminate, checked],
    )
    const mergedRef = useMergedRefs(ref, useMergedRefs(checkboxRef, setIndeterminate))

    const inputProps = {
      type: 'checkbox',
      disabled,
      ref: mergedRef,
      checked: indeterminate ? false : checked,
      defaultChecked,
      required,
      ['aria-required']: required ? ('true' as const) : ('false' as const),
      ['aria-invalid']: validationStatus === 'error' ? ('true' as const) : ('false' as const),
      onChange: handleOnChange,
      value,
      name: value,
      ...rest,
    }

    return (
      <input
        {...inputProps}
        data-component={dataComponent ?? 'Checkbox'}
        className={clsx(className, sharedClasses.Input, classes.Checkbox)}
      />
    )
  },
)

Checkbox.displayName = 'Checkbox'
;(Checkbox as WithSlotMarker<typeof Checkbox>).__SLOT__ = Symbol('Checkbox')

export default Checkbox as WithSlotMarker<typeof Checkbox>
