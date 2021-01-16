import React from 'react'
import styled, {keyframes} from 'styled-components'
import StyledOcticon from '../StyledOcticon'
import {OctofaceIcon} from '@primer/octicons-react'
import {get, COMMON} from '../constants'

const pulseKeyframes = keyframes`
  0% {
    opacity: 0.3;
  }
  10% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
`

const Animation = styled.div`
  padding: ${get('space.6')} ${get('space.4')};
  text-align: center;
  background-color: ${get('colors.white')};
  animation-name: ${pulseKeyframes};
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  ${COMMON}
`

const SelectMenuLoadingAnimation = props => {
  return (
    <Animation {...props}>
      <StyledOcticon size={32} icon={OctofaceIcon} />
    </Animation>
  )
}

SelectMenuLoadingAnimation.propTypes = {
  ...COMMON.propTypes
}

export default SelectMenuLoadingAnimation
