import styled from 'styled-components'
import {tabWrapperStyles} from './SelectMenuStyles'
import {COMMON} from './constants'
import theme from './theme'

const SelectMenuTabs = styled.nav`
  ${tabWrapperStyles}
  ${COMMON}
`

SelectMenuTabs.defaultProps = {
  theme
}

export default SelectMenuTabs