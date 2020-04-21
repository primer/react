import PropTypes from 'prop-types'
import styled from 'styled-components'
import {get, COMMON} from './constants'
import {space} from 'styled-system'
import systemPropTypes from '@styled-system/prop-types'
import theme from './theme'


function getBorderRadius(props) {
  if (props.square) {
    return props.size <= 24 ? '4px' : '6px'
  } else {
    return '50%'
  }
}

const Avatar = styled.img.attrs(props => ({
  height: props.size,
  width: props.size,
  alt: props.alt
}))`
  display: inline-block;
  overflow: hidden; // Ensure page layout in Firefox should images fail to load
  line-height: ${get('lineHeights.condensedUltra')};
  vertical-align: middle;
  border-radius: ${props => getBorderRadius(props)};
  ${COMMON};
`

Avatar.defaultProps = {
  theme,
  size: 20,
  alt: '',
  square: false
}

Avatar.propTypes = {
  alt: PropTypes.string,
  ...COMMON.propTypes,
  size: PropTypes.number,
  src: PropTypes.string,
  square: PropTypes.bool,
  theme: PropTypes.object
}

export default Avatar
