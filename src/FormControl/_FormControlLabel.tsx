import React from 'react'
import InputLabel from '../internal/components/InputLabel'
import {SxProp} from '../sx'
import {FormControlContext} from './FormControl'

export type Props = {
  /**
   * Whether the label should be visually hidden
   */
  visuallyHidden?: boolean
  id?: string
} & SxProp

const FormControlLabel: React.FC<
  React.PropsWithChildren<{htmlFor?: string} & React.ComponentProps<typeof InputLabel> & Props>
> = ({as, children, htmlFor, id, visuallyHidden, sx, ...props}) => {
  const {disabled, id: formControlId, required} = React.useContext(FormControlContext)

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
          disabled,
          sx,
          ...props,
        }
  return <InputLabel {...labelProps}>{children}</InputLabel>
}

export default FormControlLabel
