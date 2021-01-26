import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, get, SystemCommonProps} from './constants'
import theme from './theme'
import sx, {SxProp} from './sx'

interface AvatarCustomProps {
  size: number,
  square: boolean,
  alt: string
}

function getBorderRadius(props: { size: number, square: boolean }) {
  if (props.square) {
    return props.size <= 24 ? '4px' : '6px'
  } else {
    return '50%'
  }
}

const Avatar = styled.img.attrs((props: AvatarCustomProps) => ({
  height: props.size,
  width: props.size,
  alt: props.alt
}))<AvatarCustomProps & SystemCommonProps & SxProp>`
  display: inline-block;
  overflow: hidden; // Ensure page layout in Firefox should images fail to load
  line-height: ${get('lineHeights.condensedUltra')};
  vertical-align: middle;
  border-radius: ${props => getBorderRadius(props)};
  ${COMMON};
  ${sx}
`

Avatar.defaultProps = {
  theme,
  size: 20,
  alt: '',
  square: false
}

Avatar.propTypes = {
  ...COMMON.propTypes,
  size: PropTypes.number,
  square: PropTypes.bool,
  ...sx.propTypes,
  theme: PropTypes.object
}

export type AvatarProps = React.ComponentProps<typeof Avatar>
export default Avatar
