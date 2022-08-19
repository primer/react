import React, {useContext} from 'react'
import {Text} from '..'
import {SxProp} from '../sx'
import {Slot} from './slots'
import CheckboxOrRadioGroupContext from './_CheckboxOrRadioGroupContext'

const CheckboxOrRadioGroupCaption: React.FC<React.PropsWithChildren<SxProp>> = ({children, sx}) => {
  const {disabled, captionId} = useContext(CheckboxOrRadioGroupContext) ?? {}

  return (
    <Slot name="Caption">
      <Text color={disabled ? 'fg.muted' : 'fg.subtle'} fontSize={1} id={captionId} sx={sx}>
        {children}
      </Text>
    </Slot>
  )
}

export default CheckboxOrRadioGroupCaption
