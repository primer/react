import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, get, SystemCommonProps} from './constants'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

type StyledAvatarProps = {
  size?: number
  square?: boolean
} & SystemCommonProps &
  SxProp

function getBorderRadius({size, square}: StyledAvatarProps) {
  if (square) {
    return size && size <= 24 ? '4px' : '6px'
  } else {
    return '50%'
  }
}

const Avatar = styled.img.attrs<StyledAvatarProps>(props => ({
  height: props.size,
  width: props.size
}))<StyledAvatarProps>`
  display: inline-block;
  overflow: hidden; // Ensure page layout in Firefox should images fail to load
  line-height: ${get('lineHeights.condensedUltra')};
  vertical-align: middle;
  border-radius: ${props => getBorderRadius(props)};
  ${COMMON};
  ${sx}
`

Avatar.defaultProps = {
  size: 20,
  alt: '',
  square: false
}

Avatar.propTypes = {
  ...COMMON.propTypes,
  size: PropTypes.number,
  square: PropTypes.bool,
  ...sx.propTypes
}

export type AvatarProps = ComponentProps<typeof Avatar>
export default Avatar
