import styled from 'styled-components'
import {COMMON, get, SystemCommonProps} from './constants'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

type StyledAvatarProps = {
  /** Sets the width and height of the avatar. */
  size?: number
  /** Sets the shape of the avatar to a square if true. If false, the avatar will be circular. */
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

export type AvatarProps = ComponentProps<typeof Avatar>
export default Avatar
