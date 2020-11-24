import styled from 'styled-components'
import {COMMON} from './constants'
import theme from './theme'
import sx from './sx'

const Details = styled.details`
  & > summary {
    list-style: none;
  }
  & > summary::-webkit-details-marker {
    display: none;
  }

  ${COMMON}
  ${sx};
`

Details.displayName = 'Details'

Details.defaultProps = {
  theme
}

Details.propTypes = {
  ...COMMON.propTypes,
  ...sx.propTypes
}

export default Details
