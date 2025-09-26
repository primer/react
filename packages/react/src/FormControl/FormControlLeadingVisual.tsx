import type React from 'react'
import {useFormControlContext} from './_FormControlContext'
import classes from './FormControlLeadingVisual.module.css'

const FormControlLeadingVisual: React.FC<React.PropsWithChildren> = ({children}) => {
  const {disabled, captionId} = useFormControlContext()
  return (
    <div
      className={classes.LeadingVisual}
      data-control-disabled={disabled ? '' : undefined}
      data-has-caption={captionId ? '' : undefined}
    >
      {children}
    </div>
  )
}

export default FormControlLeadingVisual
