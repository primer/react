import styled from 'styled-components'
import {COMMON, TYPOGRAPHY, get} from './constants'
import theme from './theme'

const SelectMenuTitle = styled.h3`
  flex: auto;
  font-size: ${get('fontSizes.1')}px;
  font-weight: ${get('fontWeights.bold')};
  margin: 0;
  ${COMMON}
  ${TYPOGRAPHY}

  @media (min-width: ${get('breakpoints.0')}) {
    font-size: inherit;
  }
`

SelectMenuTitle.defaultProps = {
  theme
}

export default SelectMenuTitle