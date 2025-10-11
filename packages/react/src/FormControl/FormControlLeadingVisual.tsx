import type React from 'react'
import {useFormControlContext} from './_FormControlContext'
import classes from './FormControlLeadingVisual.module.css'
import type {FCWithSlotMarker} from '../utils/types'

const FormControlLeadingVisual: FCWithSlotMarker<React.PropsWithChildren<{style?: React.CSSProperties}>> = ({
  children,
  style,
}) => {
  const {disabled, captionId} = useFormControlContext()
  return (
    <div
      className={classes.LeadingVisual}
      data-control-disabled={disabled ? '' : undefined}
      style={style}
      data-has-caption={captionId ? '' : undefined}
    >
      {children}
    </div>
  )
}

FormControlLeadingVisual.__SLOT__ = Symbol('FormControl.LeadingVisual')

export default FormControlLeadingVisual
