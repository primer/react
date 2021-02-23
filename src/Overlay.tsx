import styled from 'styled-components'
import {get} from './constants'
import theme from './theme'
import {ComponentProps} from './utils/types'


const Overlay  = styled.div`
  background-color: ${get('overlay.bg')};
  box-shadow: ${get('overlay.popover.boxShadow')};
  position: absolute;
  z-index: 100;
  min-width: 196px;
  max-width: 480px;
  border-radius: ${get('overlay.borderRadius')};
  overflow: hidden;
  animation: overlay-appear 200ms ${get('animation.easeOutCubic')};

  @keyframes overlay-appear {
    0% {
      opacity: 0;
      transform: translateY(${get('space.2')});
    }
    100% {
      opacity: 1;
    }
  }
`

Overlay.defaultProps = {
  theme
}
export type OverlayProps = ComponentProps<typeof Overlay>
export default Overlay