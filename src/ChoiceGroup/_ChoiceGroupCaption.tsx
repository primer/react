import React from 'react'
import {Text} from '..'
import {SxProp} from '../sx'
import {ChoiceGroupContext} from './ChoiceGroup'
import {Slot} from './slots'

const ChoiceGroupCaption: React.FC<SxProp> = ({children}) => (
  <Slot name="Caption">
    {({disabled, captionId}: ChoiceGroupContext) => (
      <Text color={disabled ? 'fg.muted' : 'fg.subtle'} fontSize={1} id={captionId} sx={SxProp}>
        {children}
      </Text>
    )}
  </Slot>
)

export default ChoiceGroupCaption
