import PropTypes from 'prop-types'
import styled from 'styled-components'
import {get} from './constants'
import {space} from 'styled-system'
import systemPropTypes from '@styled-system/prop-types'
import theme from './theme'

function borderRadius({size, form}) {
  return {
    borderRadius: form === 'round' ? '50%' : (size <= 24 ? '2px' : '3px')
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
  form: 'square'
}

Avatar.propTypes = {
  alt: PropTypes.string.isRequired,
  size: PropTypes.number,
  src: PropTypes.string,
  ...systemPropTypes.space,
  theme: PropTypes.object,
  form: PropTypes.PropTypes.oneOf(['square', 'round'])
}

export default Avatar
