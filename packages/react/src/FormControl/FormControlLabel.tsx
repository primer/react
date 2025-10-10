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
  style?: React.CSSProperties
} & SxProp

const FormControlLabel: React.FC<
  React.PropsWithChildren<{htmlFor?: string} & React.ComponentProps<typeof InputLabel> & Props>
> = ({as, children, htmlFor, id, visuallyHidden, requiredIndicator = true, requiredText, sx, className, ...props}) => {
  const {disabled, id: formControlId, required} = useFormControlContext()

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

// @ts-ignore -- TypeScript doesn't know about the __SLOT__ property
FormControlLabel.__SLOT__ = Symbol('FormControl.Label')

export default FormControlLabel
