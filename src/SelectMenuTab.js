import styled from 'styled-components'
import {tabStyles} from './SelectMenuStyles'
import theme from './theme'
import {COMMON} from './constants'

const SelectMenuTab = styled.button.attrs(props => ({
  className: 'SelectMenuTab',
  "aria-selected": props.selected
}))`
  ${tabStyles}
  ${COMMON}
`

SelectMenuTab.defaultProps = {
  theme
}

export default SelectMenuTab