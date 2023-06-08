import React from 'react'
import Text from '../../../Text'
import {SxProp} from '../../../sx'
import {CheckboxOrRadioGroupContext} from './CheckboxOrRadioGroup'

const CheckboxOrRadioGroupCaption: React.FC<React.PropsWithChildren<SxProp>> = ({children, sx}) => {
  const {disabled, captionId} = React.useContext(CheckboxOrRadioGroupContext)
  return (
    <Text color={disabled ? 'fg.muted' : 'fg.subtle'} fontSize={1} id={captionId} sx={sx}>
      {children}
    </Text>
  )
}

export default CheckboxOrRadioGroupCaption
