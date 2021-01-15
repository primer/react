import PropTypes from 'prop-types'
import css, {SystemStyleObject} from '@styled-system/css'

export interface SxProp {
  sx?: SystemStyleObject
}

const sx = (props: SxProp) => css(props.sx)

sx.propTypes = {
  sx: PropTypes.object,
}

export default sx
