import React from 'react'
import InputLabel from '../internal/components/InputLabel'
import type {SxProp} from '../sx'
import {useFormControlContext} from './_FormControlContext'

export type Props = {
  /**
   * Whether the label should be visually hidden
   */
  visuallyHidden?: boolean
  requiredText?: string
  requiredIndicator?: boolean
  id?: string
} & SxProp

const FormControlLabel: React.FC<
  React.PropsWithChildren<{htmlFor?: string} & React.ComponentProps<typeof InputLabel> & Props>
> = ({as, children, htmlFor, id, visuallyHidden, requiredIndicator = true, requiredText, sx, ...props}) => {
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
