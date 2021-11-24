import React from 'react'
import InputCaption from '../_InputCaption'
import {ChoiceFieldsetContext, Slot} from './ChoiceFieldset'

const ChoiceFieldsetCaption: React.FC = ({children}) => (
  <Slot name="Caption">
    {({captionId}: ChoiceFieldsetContext) => <InputCaption id={captionId}>{children}</InputCaption>}
  </Slot>
)

export default ChoiceFieldsetCaption
