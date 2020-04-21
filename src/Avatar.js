import PropTypes from 'prop-types'
import styled from 'styled-components'
import {get} from './constants'
import {space} from 'styled-system'
import systemPropTypes from '@styled-system/prop-types'
import theme from './theme'

function borderRadiusValue({size, shape}) {
  switch (shape) {
    case 'circle':
      return '50%'
    default:
      return size <= 24 ? '5px' : '6px'
  }
}

function borderRadius({size, shape}) {
  return {
    borderRadius: borderRadiusValue({size, shape})
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
`

Avatar.defaultProps = {
  theme,
  size: 20,
  alt: '',
  shape: 'circle'
}

Avatar.propTypes = {
  alt: PropTypes.string.isRequired,
  size: PropTypes.number,
  src: PropTypes.string,
  ...systemPropTypes.space,
  shape: PropTypes.PropTypes.oneOf(['square', 'circle']),
  theme: PropTypes.object
}

export default Avatar
