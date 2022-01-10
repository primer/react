import styled from 'styled-components'
import sx, {SxProp} from './sx'

interface Props {
  isVisible?: boolean
}

const VisuallyHidden = styled.span<Props & SxProp>`
  ${props => {
    if (props.isVisible) {
      return sx
    }

    return `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    `
  }}
`

VisuallyHidden.defaultProps = {
  isVisible: true
}

export default VisuallyHidden
