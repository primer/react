import BorderBox from './BorderBox'
import React from 'react'
import {XIcon} from '@primer/octicons-react'

const CloseButton = props => (
  <BorderBox borderWidth="0" bg="none" color="text.white" sx={{cursor: 'pointer'}} {...props}>
    <XIcon />
  </BorderBox>
)

export default CloseButton
