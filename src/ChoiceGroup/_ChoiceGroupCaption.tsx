import React from 'react'
import {Text} from '..'
import {ChoiceGroupContext} from './ChoiceGroup'
import {Slot} from './slots'

const ChoiceGroupCaption: React.FC = ({children}) => (
  <Slot name="Caption">
    {({disabled, captionId}: ChoiceGroupContext) => (
      <Text color={disabled ? 'fg.muted' : 'fg.subtle'} fontSize={1} id={captionId}>
        {children}
      </Text>
    )}
  </Slot>
)

export default ChoiceGroupCaption
