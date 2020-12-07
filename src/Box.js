import styled from 'styled-components'
import PropTypes from 'prop-types'
import sx from './sx'
import {COMMON, FLEX, LAYOUT} from './constants'
import theme from './theme'

const Box = styled.div`
  ${COMMON}
  ${FLEX}
  ${LAYOUT}
  ${sx};
`

Box.defaultProps = {theme}

Box.propTypes = {
  ...COMMON.propTypes,
  ...FLEX.propTypes,
  ...LAYOUT.propTypes,
  ...sx.propTypes,
  theme: PropTypes.object,
}

export default Box
