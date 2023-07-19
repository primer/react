import React from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import sx, {BetterCssProperties, BetterSystemStyleObject, SxProp, merge} from '../sx'
import {ComponentProps} from '../utils/types'
import {ResponsiveValue, isResponsiveValue} from '../hooks/useResponsiveValue'
import {getBreakpointDeclarations} from '../utils/getBreakpointDeclarations'
import {defaultSxProp} from '../utils/defaultSxProp'

export const DEFAULT_AVATAR_SIZE = 20

type StyledAvatarProps = {
  /** Sets the width and height of the avatar. */
  size?: number | ResponsiveValue<number>
  /** Sets the shape of the avatar to a square if true. If false, the avatar will be circular. */
  square?: boolean
  /** URL of the avatar image. */
  src: string
  /** Provide alt text when the Avatar is used without the user's name next to it. */
  alt?: string
} & SxProp

const StyledAvatar = styled.img.attrs<StyledAvatarProps>(props => ({
  height: props.size,
  width: props.size,
}))<StyledAvatarProps>`
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

export type AvatarProps = ComponentProps<typeof StyledAvatar>

const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>(function Avatar(
  {alt = '', size = DEFAULT_AVATAR_SIZE, square = false, sx: sxProp = defaultSxProp, ...rest},
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
  return <StyledAvatar ref={ref} alt={alt} size={size} square={square} sx={avatarSx} {...rest} />
})

if (__DEV__) {
  Avatar.displayName = 'Avatar'
}

export default Avatar
