import React from 'react'
import {Slot} from '../deprecated/InputField/slots'

const ChoiceInputLeadingVisual: React.FC<React.PropsWithChildren<unknown>> = ({children}) => (
  <Slot name="LeadingVisual">{children}</Slot>
)

export default ChoiceInputLeadingVisual
