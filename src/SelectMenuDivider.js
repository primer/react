import styled from 'styled-components'
import {dividerStyles} from './SelectMenuStyles'
import theme from './theme'
import {COMMON} from './constants'

const SelectMenuDivider = styled.div`
  ${dividerStyles}
  ${COMMON}
`

SelectMenuDivider.defaultProps = {
  theme
}

export default SelectMenuDivider
