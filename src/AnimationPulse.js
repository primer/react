import styled, {keyframes} from 'styled-components'
import {COMMON} from './constants'
import theme from './theme'

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

const AnimationPulse = styled.span`
  animation-name: ${pulseKeyframes};
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  ${COMMON}
`

AnimationPulse.defaultProps = {
  theme
}

export default AnimationPulse
