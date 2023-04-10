import React from 'react'
import Text from '../Text'
import {SxProp} from '../sx'
import {CheckboxOrRadioGroupContext} from './CheckboxOrRadioGroup'
import {Slot} from './slots'

const CheckboxOrRadioGroupCaption: React.FC<React.PropsWithChildren<SxProp>> = ({children, sx}) => (
  <Slot name="Caption">
    {({disabled, captionId}: CheckboxOrRadioGroupContext) => (
      <Text color={disabled ? 'fg.muted' : 'fg.subtle'} fontSize={1} id={captionId} sx={sx}>
        {children}
      </Text>
    )}
  </Slot>
)

export default CheckboxOrRadioGroupCaption
