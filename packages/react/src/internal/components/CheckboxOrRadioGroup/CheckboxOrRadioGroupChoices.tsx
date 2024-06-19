import React from 'react'
import type {SxProp} from '../../../sx'
import Box from '../../../Box'
import styled from 'styled-components'
import {get} from '../../../constants'

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;

  > * + * {
    margin-top: ${get('space.2')};
  }
`

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
