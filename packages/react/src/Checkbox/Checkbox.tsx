import {clsx} from 'clsx'
import {useProvidedRefOrCreate} from '../hooks'
import React, {useContext, useEffect, type ChangeEventHandler, type InputHTMLAttributes, type ReactElement} from 'react'
import {type SxProp} from '../sx'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import type {FormValidationStatus} from '../utils/types/FormValidationStatus'
import {CheckboxGroupContext} from '../CheckboxGroup/CheckboxGroupContext'
import classes from './Checkbox.module.css'
import sharedClasses from './shared.module.css'
import Box from '../Box'

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
} & Exclude<InputHTMLAttributes<HTMLInputElement>, 'value'> &
  SxProp

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
      sx: sxProp,
      required,
      validationStatus,
      value,
      ...rest
    },
    ref,
  ): ReactElement => {
    const checkboxRef = useProvidedRefOrCreate(ref as React.RefObject<HTMLInputElement>)
    const checkboxGroupContext = useContext(CheckboxGroupContext)
    const handleOnChange: ChangeEventHandler<HTMLInputElement> = e => {
      checkboxGroupContext.onChange && checkboxGroupContext.onChange(e)
      onChange && onChange(e)
    }
    const inputProps = {
      type: 'checkbox',
      disabled,
      ref: checkboxRef,
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

    useLayoutEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = indeterminate || false
      }
    }, [indeterminate, checked, checkboxRef])

    useEffect(() => {
      const {current: checkbox} = checkboxRef
      if (!checkbox) {
        return
      }

      if (indeterminate) {
        checkbox.setAttribute('aria-checked', 'mixed')
      } else {
        checkbox.setAttribute('aria-checked', checkbox.checked ? 'true' : 'false')
      }
    })

    if (sxProp) {
      return (
        <Box
          as="input"
          {...inputProps}
          className={clsx(className, sharedClasses.Input, classes.Checkbox)}
          sx={sxProp}
        />
      )
    }
    return <input {...inputProps} className={clsx(className, sharedClasses.Input, classes.Checkbox)} />
  },
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
