import React from 'react'
import {SxProp} from '../sx'
import InputCaption from '../_InputCaption'
import {Slot} from './slots'
import {FormControlContext} from './_FormControlContext'

const FormControlCaption: React.FC<React.PropsWithChildren<{id?: string} & SxProp>> = ({children, sx, id}) => {
  const {captionId, disabled} = React.useContext(FormControlContext) ?? {}
  return (
    <Slot name="Caption">
      <InputCaption id={(id || captionId) ?? ''} disabled={disabled} sx={sx}>
        {children}
      </InputCaption>
    </Slot>
  )
}

export default FormControlCaption
