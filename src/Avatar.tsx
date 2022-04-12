import React from 'react'
import Box from './Box'
import {SxProp, merge} from './sx'

export type AvatarProps = {
  /** Sets the width and height of the avatar. */
  size?: number
  /** Sets the shape of the avatar to a square if true. If false, the avatar will be circular. */
  square?: boolean
  /** URL of the avatar image. */
  src: string
  /** Provide alt text when the Avatar is used without the user's name next to it. */
  alt?: string
} & SxProp

function getBorderRadius({size, square}: Pick<AvatarProps, 'size' | 'square'>) {
  if (square) {
    return size && size <= 24 ? '4px' : '6px'
  } else {
    return '50%'
  }
}

export const Avatar: React.FC<AvatarProps> = ({size = 20, alt = '', square = false, sx = {}, ...props}) => {
  const styles = {
    display: 'inline-block',
    overflow: 'hidden',
    lineHeight: 'condensedUltra',
    verticalAlign: 'middle',
    width: size,
    height: size,
    borderRadius: getBorderRadius({size, square})
  }
  return <Box as="img" alt={alt} sx={merge(styles, sx as SxProp)} {...props} />
}

export default Avatar
