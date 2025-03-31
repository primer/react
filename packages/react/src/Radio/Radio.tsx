import type {ChangeEventHandler, InputHTMLAttributes, ReactElement} from 'react'
import React, {useContext} from 'react'
import type {SxProp} from '../sx'
import {RadioGroupContext} from '../RadioGroup/RadioGroup'
import {clsx} from 'clsx'
import sharedClasses from '../Checkbox/shared.module.css'
import classes from './Radio.module.css'
import {defaultSxProp} from '../utils/defaultSxProp'
import Box from '../Box'

export type RadioProps = {
  /**
   * A unique value that is never shown to the user.
   * Used during form submission and to identify which radio button in a group is selected
   */
  value: string
  /**
   * Name attribute of the input element. Required for grouping radio inputs
   */
  name?: string
  /**
   * Apply inactive visual appearance to the radio button
   */
  disabled?: boolean
  /**
   * Indicates whether the radio button is selected
   */
  checked?: boolean
  /**
   * Forward a ref to the underlying input element
   */
  ref?: React.RefObject<HTMLInputElement>
  /**
   * Indicates whether the radio button must be checked before the form can be submitted
   */
  required?: boolean
} & InputHTMLAttributes<HTMLInputElement> &
  SxProp

/**
 * An accessible, native radio component for selecting one option from a list.
 */
const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      checked,
      disabled,
      name: nameProp,
      onChange,
      sx: sxProp = defaultSxProp,
      required,
      value,
      className,
      ...rest
    }: RadioProps,
    ref,
  ): ReactElement => {
    const radioGroupContext = useContext(RadioGroupContext)
    const handleOnChange: ChangeEventHandler<HTMLInputElement> = e => {
      radioGroupContext?.onChange && radioGroupContext.onChange(e)
      onChange && onChange(e)
    }
    const name = nameProp || radioGroupContext?.name

    if (!name) {
      // eslint-disable-next-line no-console
      console.warn(
        'A radio input must have a `name` attribute. Pass `name` as a prop directly to each Radio, or nest them in a `RadioGroup` component with a `name` prop',
      )
    }

    if (sxProp !== defaultSxProp) {
      return (
        <Box
          as="input"
          sx={sxProp}
          type="radio"
          value={value}
          name={name}
          ref={ref}
          disabled={disabled}
          checked={checked}
          aria-checked={checked ? 'true' : 'false'}
          required={required}
          onChange={handleOnChange}
          className={clsx(className, sharedClasses.Input, classes.Radio)}
          {...rest}
        />
      )
    }

    return (
      <input
        type="radio"
        value={value}
        name={name}
        ref={ref}
        disabled={disabled}
        checked={checked}
        aria-checked={checked ? 'true' : 'false'}
        required={required}
        onChange={handleOnChange}
        className={clsx(className, sharedClasses.Input, classes.Radio)}
        {...rest}
      />
    )
  },
)

Radio.displayName = 'Radio'

export default Radio
