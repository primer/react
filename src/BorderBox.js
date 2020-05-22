import styled from 'styled-components'
import sx from './sx'
import PropTypes from 'prop-types'
import Box from './Box'
import theme from './theme'
import {BORDER} from './constants'

const BorderBox = styled(Box)`
  ${BORDER};
  ${sx};
`

BorderBox.defaultProps = {
  theme,
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'gray.2',
  borderRadius: 2
}

BorderBox.propTypes = {
  ...Box.propTypes,
  ...BORDER.propTypes,
  ...sx.propTypes,
  theme: PropTypes.object
}

export default BorderBox
