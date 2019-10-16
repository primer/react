import styled from 'styled-components'
import {tabWrapperStyles} from './SelectMenuStyles'
import {COMMON} from './constants'
import theme from './theme'

const SelectMenuTabs = styled.nav.attrs({
  role: 'tablist'
})`
  ${tabWrapperStyles}
  ${COMMON}
`

SelectMenuTabs.defaultProps = {
  theme
}

export default SelectMenuTabs
