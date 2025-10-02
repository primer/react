import type React from 'react'
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
  as?: 'label' | 'legend' | 'span'
}

type FormControlLabelProps = React.PropsWithChildren<React.ComponentProps<typeof InputLabel> & Props>

const FormControlLabel: React.FC<FormControlLabelProps> = ({
  as,
  children,
  htmlFor,
  id,
  visuallyHidden,
  requiredIndicator = true,
  requiredText,
  className,
  ...props
}) => {
  const {disabled, id: formControlId, required} = useFormControlContext()

  // Base props that are common to all element types
  const baseProps = {
    id,
    className,
    visuallyHidden,
    required,
    requiredText,
    requiredIndicator,
    disabled,
    ...props,
  }

  // For legend and span elements, don't pass htmlFor
  if (as === 'legend' || as === 'span') {
    return (
      <InputLabel as={as} {...baseProps}>
        {children}
      </InputLabel>
    )
  }

  // For label elements (default), include htmlFor
  return (
    <InputLabel as={as} htmlFor={htmlFor || formControlId} {...baseProps}>
      {children}
    </InputLabel>
  )
}

export default FormControlLabel
