import PropTypes from 'prop-types'
import css from '@styled-system/css'

const sx = props => css(props.sx)

sx.propTypes = {
  sx: PropTypes.object
}

export default sx
