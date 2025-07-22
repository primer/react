import type React from 'react'
import type {SxProp} from '../sx'
import {useFormControlContext} from './_FormControlContext'
import {InputLabel} from '../internal/components/InputLabel'

export type Props = {
  /**
   * Whether the label should be visually hidden
   */
  visuallyHidden?: boolean
  requiredText?: string
  requiredIndicator?: boolean
  id?: string
  className?: string
} & SxProp

const FormControlLabel: React.FC<
  React.PropsWithChildren<{htmlFor?: string} & React.ComponentProps<typeof InputLabel> & Props>
> = ({as, children, htmlFor, id, visuallyHidden, requiredIndicator = true, requiredText, sx, className, ...props}) => {
  const {disabled, id: formControlId, required, isReferenced} = useFormControlContext()
  console.log('FormControlLabel', {
    as,
    htmlFor,
    id,
    visuallyHidden,
    requiredIndicator,
    requiredText,
    sx,
    className,
    props,
  })
  /**
   * Ensure we can pass through props correctly, since legend/span accept no defined 'htmlFor'
   */
  const labelProps: React.ComponentProps<typeof InputLabel> =
    as === 'legend' || as === 'span'
      ? {
          as,
          id,
          className,
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
          className,
          visuallyHidden,
          htmlFor: isReferenced ? htmlFor || formControlId : undefined,
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
