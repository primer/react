import type React from 'react'
import {useFormControlContext} from './_FormControlContext'
import classes from './FormControlLeadingVisual.module.css'
import type {HTMLAttributes} from 'react'

const FormControlLeadingVisual: React.FC<React.PropsWithChildren> & HTMLAttributes<HTMLDivElement> = ({
  children,
  ...props
}) => {
  const {disabled, captionId} = useFormControlContext()
  return (
    <div
      className={classes.LeadingVisual}
      data-control-disabled={disabled ? '' : undefined}
      data-has-caption={captionId ? '' : undefined}
      {...props}
    >
      {children}
    </div>
  )
}

export default FormControlLeadingVisual
