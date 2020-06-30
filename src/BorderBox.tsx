import styled from 'styled-components'
import sx, {propTypes as sxPropTypes} from './sx'
import PropTypes from 'prop-types'
import Box from './Box'
import theme from './theme'
import {BORDER} from './constants'

const borderBoxPropTypes = {
  ...Box.propTypes,
  ...BORDER.propTypes,
  ...sxPropTypes,
  theme: PropTypes.object
}

export type BorderBoxProps = PropTypes.InferProps<typeof borderBoxPropTypes>

const BorderBox: React.FC<BorderBoxProps> = styled(Box)`
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

BorderBox.propTypes = borderBoxPropTypes

export default BorderBox
