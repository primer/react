import styled from 'styled-components'
import PropTypes from './DocPropTypes'
import Box from './Box'
import theme from './theme'
import {BORDER} from './constants'

const BorderBox = styled(Box)(BORDER)

BorderBox.defaultProps = {
  theme,
  border: '1px solid',
  borderColor: 'gray.2',
  borderRadius: 2
}

BorderBox.propTypes = PropTypes.doc({
  system: [BORDER],
  inherited: [Box],
  own: {
    border: PropTypes.string.desc('Sets the border; use theme values or provide your own'),
    borderColor: PropTypes.string.desc('Sets the border; use theme values or provide your own'),
    borderRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).desc(
      'Sets the border radius, use theme values or provide your own'
    ),
    boxShadow: PropTypes.string.desc('Sets box shadow, use theme values or provide your own'),
    theme: PropTypes.object.hidden
  }
})

export default BorderBox
