import styled from 'styled-components'
import {listStyles} from './SelectMenuStyles'
import theme from './theme'

const SelectMenuList = styled.div`
  ${listStyles}
`
SelectMenuList.defaultProps = {
  theme
}

export default SelectMenuList