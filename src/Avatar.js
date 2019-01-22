import PropTypes from 'prop-types'
import styled from 'styled-components'
import {get} from './constants'
import {space} from 'styled-system'
import theme from './theme'

function borderRadius({size}) {
  return {
    borderRadius: size <= 24 ? '2px' : '3px'
  }
}

const Avatar = styled.img.attrs(props => ({
  height: props.size,
  width: props.size
}))`
  display: inline-block;
  overflow: hidden; // Ensure page layout in Firefox should images fail to load
  line-height: ${get('lineHeights.condensedUltra')};
  vertical-align: middle;
  ${borderRadius};
  ${space};
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
  ...space.propTypes,
  theme: PropTypes.object
}

export default Avatar
