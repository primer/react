import styled from 'styled-components'
import PropTypes from 'prop-types'
import sx from './sx'
import {get} from './constants'
import {space} from 'styled-system'
import systemPropTypes from '@styled-system/prop-types'
import theme from './theme'

function borderRadius({size}) {
  return {
    borderRadius: size <= 24 ? '2px' : '3px'
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
  ${borderRadius};
  ${space};
  ${sx};
`

Avatar.defaultProps = {
  theme,
  size: 20,
  alt: ''
}

Avatar.propTypes = {
  alt: PropTypes.string.isRequired,
  size: PropTypes.number,
  src: PropTypes.string,
  ...systemPropTypes.space,
  ...sx.propTypes,
  theme: PropTypes.object
}

export default Avatar
