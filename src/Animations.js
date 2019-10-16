import styled, {keyframes} from 'styled-components'
import {COMMON} from './constants'
import theme from './theme'

const Animations = {}

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

Animations.Pulse = styled.span`
  animation-name: ${pulseKeyframes};
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  ${COMMON}
`

Animations.Pulse.defaultProps = {
  theme
}

export default Animations
