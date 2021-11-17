import React from 'react'
import InputValidation from '../InputValidation'
import {ChoiceFieldsetContext, Slot} from './ChoiceFieldset'

const ChoiceFieldsetValidation: React.FC = ({children}) => (
  <Slot name="Validation">
    {({validationMessageId, validationStatus}: ChoiceFieldsetContext) => (
      <InputValidation id={validationMessageId} validationStatus={validationStatus}>
        {children}
      </InputValidation>
    )}
  </Slot>
)

export default ChoiceFieldsetValidation
