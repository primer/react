import ButtonInvisible from './Button/ButtonInvisible'
import React from 'react'
import {XIcon} from '@primer/octicons-react'

const CloseButton = (props) => (
  <ButtonInvisible aria-label="Close" color="text.white" p={0} {...props}>
    <XIcon />
  </ButtonInvisible>
)

export default CloseButton
