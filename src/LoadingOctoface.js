import React from 'react'
import Box from './Box'
import AnimationPulse from './AnimationPulse'
import StyledOcticon, {Octoface} from '@primer/octicons-react'

const LoadingOctoface = props => {
  return (
    <Box bg="white" py={4} px={3} css="text-align: center" {...props}>
      <AnimationPulse>
        <StyledOcticon size={32} icon={Octoface} />
      </AnimationPulse>
    </Box>
  )
}

export default LoadingOctoface
