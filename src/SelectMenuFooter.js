import styled from 'styled-components'
import {footerStyles} from './SelectMenuStyles'
import {COMMON} from './constants'
import theme from './theme'

const SelectMenuFooter = styled.footer`
  ${footerStyles}
  ${COMMON}
`

SelectMenuFooter.defaultProps = {
  theme
}

export default SelectMenuFooter