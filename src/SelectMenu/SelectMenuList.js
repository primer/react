import styled from 'styled-components'
import {listStyles} from './SelectMenuStyles'
import theme from '../theme'
import {COMMON} from '../constants'

const SelectMenuList = styled.div`
  ${listStyles}
  ${COMMON}
`
SelectMenuList.defaultProps = {
  theme
}

SelectMenuList.propTypes = {
  ...COMMON.propTypes
}

export default SelectMenuList
