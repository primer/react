import React from 'react'
import Box from './Box'
import Animations from './Animations'
import StyledOcticon, {Octoface} from '@primer/octicons-react'

const SelectMenuLoading = (props) => {
  return (
    <Box bg='white' py={4} px={3} css='text-align: center' {...props}>
      <Animations.Pulse>
        <StyledOcticon size={32} icon={Octoface}/>
      </Animations.Pulse>
    </Box>
  )
}

export default SelectMenuLoading