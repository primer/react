import React from 'react'
import type {FC, PropsWithChildren} from 'react'
import Text from '../../../Text'
import type {SxProp} from '../../../sx'
import CheckboxOrRadioGroupContext from './CheckboxOrRadioGroupContext'

const CheckboxOrRadioGroupCaption: FC<PropsWithChildren<SxProp>> = ({children, sx}) => {
  const {disabled, captionId} = React.useContext(CheckboxOrRadioGroupContext)
  return (
    <Text color={disabled ? 'fg.muted' : 'fg.subtle'} fontSize={1} id={captionId} sx={sx}>
      {children}
    </Text>
  )
}

export default CheckboxOrRadioGroupCaption
