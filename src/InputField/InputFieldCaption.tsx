import React from 'react'
import {Text} from '..'
import {Slot} from './InputField'

const InputFieldCaption: React.FC = ({children}) => (
  <Slot name="Caption">
    <Text color="fg.muted" fontSize={0}>
      {children}
    </Text>
  </Slot>
)

export default InputFieldCaption
