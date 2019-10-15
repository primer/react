import styled from 'styled-components'
import {get, COMMON} from './constants'
import theme from './theme'

const SelectMenuHeader = styled.header`
  display: flex;
  flex: none; // fixes header from getting squeezed in Safari iOS
  padding: ${get('space.3')}px;
  ${COMMON}

  @media (min-width: ${get('breakpoints.0')}) {
    padding-top: ${get('space.2')}px;
    padding-bottom: ${get('space.2')}px;
  }
`

SelectMenuHeader.defaultProps = {
  theme
}

export default SelectMenuHeader