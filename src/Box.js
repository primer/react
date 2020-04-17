import styled from 'styled-components'
import PropTypes from 'prop-types'
import systemPropTypes from '@styled-system/prop-types'
import {COMMON, FLEX, LAYOUT} from './constants'
import theme from './theme'

const Box = styled.div`
  ${COMMON}
  ${FLEX}
  ${LAYOUT}
`

Box.defaultProps = {theme}

Box.propTypes = {
  ...FLEX.propTypes,
  ...LAYOUT.propTypes,
  ...systemPropTypes.space,
  ...systemPropTypes.color,
  theme: PropTypes.object
}

export default Box
