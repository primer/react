import React from 'react'
import {Text} from '../..'
import {ChoiceFieldsetContext, Slot} from './ChoiceFieldset'

const ChoiceFieldsetDescription: React.FC<React.PropsWithChildren<unknown>> = ({children}) => {
  const {disabled} = React.useContext(ChoiceFieldsetContext) ?? {}

  return (
    <Slot name="Description">
      <Text color={disabled ? 'fg.muted' : 'fg.default'} fontSize={1}>
        {children}
      </Text>
    </Slot>
  )
}

export default ChoiceFieldsetDescription
