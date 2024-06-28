import React from 'react'
import type {FC, ComponentProps, PropsWithChildren} from 'react'
import InputLabel from '../internal/components/InputLabel'
import type {SxProp} from '../sx'
import {useFormControlContext} from './_FormControlContext'

export type Props = {
  /**
   * Whether the label should be visually hidden
   * @default false
   */
  visuallyHidden?: boolean
  /**
   * The text to display when the field is required
   * @default *
   */
  requiredText?: string
  /**
   * Whether to show or hide the required text in the accessibility tree, the required text is still shown visually.
   * @default true
   */
  requiredIndicator?: boolean
  /**
   * When `as` prop is 'label', it may be used to override the `htmlFor` given to the <label> element by FormControl's React Context.
   * When 'as' prop is 'legend' or 'span', it is used as the `id` for the element.
   */
  id?: string
} & SxProp

/*
TODO: determine if we can (or should) exclude the following props from `ComponentProps<typeof InputLabel>`
since they are intended to be controlled by the FormControl context:
- required
- disabled
*/
/**
 * The label for the input in the field.
 * @alias FormControl.Label
 * @primerparentid form_control
 */
const FormControlLabel: FC<PropsWithChildren<{htmlFor?: string} & ComponentProps<typeof InputLabel> & Props>> = ({
  as,
  children,
  htmlFor,
  id,
  visuallyHidden,
  requiredIndicator = true,
  requiredText,
  sx,
  ...props
}) => {
  const {disabled, id: formControlId, required} = useFormControlContext()

  /**
   * Ensure we can pass through props correctly, since legend/span accept no defined 'htmlFor'
   */
  const labelProps: React.ComponentProps<typeof InputLabel> =
    as === 'legend' || as === 'span'
      ? {
          as,
          id,
          visuallyHidden,
          required,
          requiredText,
          requiredIndicator,
          disabled,
          sx,
          ...props,
        }
      : {
          as,
          id,
          visuallyHidden,
          htmlFor: htmlFor || formControlId,
          required,
          requiredText,
          requiredIndicator,
          disabled,
          sx,
          ...props,
        }
  return <InputLabel {...labelProps}>{children}</InputLabel>
}

export default FormControlLabel
