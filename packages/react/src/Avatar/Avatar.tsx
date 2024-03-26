import React from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import type {BetterCssProperties, BetterSystemStyleObject, SxProp} from '../sx'
import sx, {merge} from '../sx'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import {isResponsiveValue} from '../hooks/useResponsiveValue'
import {getBreakpointDeclarations} from '../utils/getBreakpointDeclarations'
import {defaultSxProp} from '../utils/defaultSxProp'
import type {ComponentProps} from '../utils/types'

export const DEFAULT_AVATAR_SIZE = 20

type ImageData = {src: string; [key: string]: unknown}
type AvatarImageSource = string | ImageData
type AvatarBaseProps<T extends AvatarImageSource> = {
  /** Sets the width and height of the avatar. */
  size?: number | ResponsiveValue<number>
  /** Sets the shape of the avatar to a square if true. If false, the avatar will be circular. */
  square?: boolean
  /** Provide alt text when the Avatar is used without the user's name next to it. */
  alt?: string
  /** The source of the avatar image. Either a url or image-data with a url nested inside */
  src: T
} & SxProp

const StyledAvatar = styled.img.attrs<AvatarBaseProps<string>>(props => ({
  height: props.size,
  width: props.size,
}))<AvatarBaseProps<string>>`
  display: inline-block;
  overflow: hidden; // Ensure page layout in Firefox should images fail to load
  line-height: ${get('lineHeights.condensedUltra')};
  vertical-align: middle;
  // If the avatar is square and size is greater than 24px (at any breakpoint), border-radius will be 6px. Otherwise, it will be 4px.
  border-radius: ${props => (props.square ? 'clamp(4px, var(--avatar-size) - 24px, 6px)' : '50%')};
  box-shadow: 0 0 0 1px ${get('colors.avatar.border')};
  height: var(--avatar-size);
  width: var(--avatar-size);
  ${sx}
`

function getUrlFromAvatarImageSource(src: AvatarImageSource): string {
  return typeof src === 'string' ? src : src.src
}

const Avatar = React.forwardRef<HTMLImageElement, AvatarBaseProps<AvatarImageSource>>(function Avatar(
  {alt = '', size = DEFAULT_AVATAR_SIZE, square = false, sx: sxProp = defaultSxProp, src, ...rest},
  ref,
) {
  const avatarSx = isResponsiveValue(size)
    ? merge<BetterCssProperties | BetterSystemStyleObject>(
        getBreakpointDeclarations(
          size,
          '--avatar-size' as keyof React.CSSProperties,
          value => `${value || DEFAULT_AVATAR_SIZE}px`,
        ),
        sxProp as SxProp,
      )
    : merge({'--avatar-size': `${size}px`} as React.CSSProperties, sxProp as SxProp)

  const imageSourceURL = getUrlFromAvatarImageSource(src)
  return <StyledAvatar ref={ref} alt={alt} size={size} square={square} sx={avatarSx} src={imageSourceURL} {...rest} />
})

if (__DEV__) {
  Avatar.displayName = 'Avatar'
}

export type AvatarProps = ComponentProps<typeof Avatar>

export default Avatar
