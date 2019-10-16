import styled from 'styled-components'
import PropTypes from 'prop-types'
import {tabStyles} from './SelectMenuStyles'
import theme from './theme'
import {COMMON} from './constants'

const SelectMenuTab = styled.button.attrs(props => ({
  className: 'SelectMenuTab',
  role: 'tab',
  'aria-selected': props.selected
}))`
  ${tabStyles}
  ${COMMON}
`

SelectMenuTab.defaultProps = {
  theme,
  selected: false
}

SelectMenuTab.propTypes = {
  selected: PropTypes.bool
}

export default SelectMenuTab
