import styled from 'styled-components'
import {maxWidth} from 'styled-system'
import PropTypes from 'prop-types'
import {TYPOGRAPHY, COMMON} from './constants'
import theme from './theme'
import sx from './sx'

const Truncate = styled('div')`
  ${TYPOGRAPHY}
  ${COMMON}
  display: ${(props) => (props.inline ? 'inline-block' : 'inherit')};
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: ${(props) => (props.inline ? 'top' : 'initial')};
  white-space: nowrap;
  ${maxWidth}
  ${(props) => (props.expandable ? `&:hover { max-width: 10000px; }` : '')}
  ${sx};
`

Truncate.defaultProps = {
  as: 'div',
  expandable: false,
  inline: false,
  maxWidth: 125,
  theme,
}

Truncate.propTypes = {
  ...TYPOGRAPHY.propTypes,
  ...COMMON.propTypes,
  expandable: PropTypes.bool,
  inline: PropTypes.bool,
  ...sx.propTypes,
  maxWidth: PropTypes.number,
  theme: PropTypes.object,
  title: PropTypes.string.isRequired,
}

export default Truncate
