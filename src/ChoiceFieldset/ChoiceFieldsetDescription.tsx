import React from 'react'
import {Text} from '..'
import {ChoiceFieldsetContext, Slot} from './ChoiceFieldset'

const ChoiceFieldsetDescription: React.FC = ({children}) => (
  <Slot name="Description">
    {({disabled}: ChoiceFieldsetContext) => (
      <Text color={disabled ? 'fg.muted' : 'fg.default'} fontSize={1}>
        {children}
      </Text>
    )}
  </Slot>
)

export default ChoiceFieldsetDescription
