import styled from 'styled-components'
import PropTypes from './DocPropTypes'
import {COMMON, LAYOUT} from './constants'
import theme from './theme'

const Box = styled.div`
  ${LAYOUT}
  ${COMMON}
`

Box.defaultProps = {theme}

Box.propTypes = PropTypes.doc({
  system: [COMMON, LAYOUT],
  own: {
    theme: PropTypes.object.hidden
  }
})

export default Box
