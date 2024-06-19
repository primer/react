import React from 'react'
import type {SxProp} from '../../../sx'
import Box from '../../../Box'
import {Body} from './CheckboxOrRadioGroup'

const CheckboxOrRadioGroupChoices: React.FC<React.PropsWithChildren<SxProp>> = ({children, sx}) => {
  return (
    <Box sx={{...sx}}>
      <Body as="ul">
        {React.Children.toArray(children)
          .filter(child => React.isValidElement(child))
          .map((child, i) => (
            <li key={i}>{child}</li>
          ))}
      </Body>
    </Box>
  )
}

export default CheckboxOrRadioGroupChoices
