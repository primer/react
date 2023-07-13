import clsx from 'clsx'
import React from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import Box from '../Box'
import sx, {BetterCssProperties, BetterSystemStyleObject, SxProp, merge} from '../sx'
import {AvatarProps, DEFAULT_AVATAR_SIZE} from '../Avatar/Avatar'
import {ResponsiveValue, isResponsiveValue} from '../hooks/useResponsiveValue'
import {getBreakpointDeclarations} from '../utils/getBreakpointDeclarations'
import {defaultSxProp} from '../utils/defaultSxProp'
import {WidthOnlyViewportRangeKeys} from '../utils/types/ViewportRangeKeys'

type StyledAvatarStackWrapperProps = {
  count?: number
} & SxProp

const AvatarStackWrapper = styled.span<StyledAvatarStackWrapperProps>`
  --avatar-border-width: 1px;
  --avatar-two-margin: calc(var(--avatar-stack-size) * -0.55);
  --avatar-three-margin: calc(var(--avatar-stack-size) * -0.85);

  // this calc explained:
  // 1. avatar size + the non-overlapping part of the second avatar
  // 2. + the non-overlapping part of the second and third avatar
  // 3. + the border widths of all previous avatars
  --avatar-stack-three-plus-min-width: calc(
    var(--avatar-stack-size) +
      calc(
        calc(var(--avatar-stack-size) + var(--avatar-two-margin)) +
          calc(var(--avatar-stack-size) + var(--avatar-three-margin)) * 2
      ) + calc(var(--avatar-border-width) * 3)
  );
  display: flex;
  position: relative;
  height: var(--avatar-stack-size);
  min-width: ${props => (props.count === 1 ? 'var(--avatar-stack-size)' : props.count === 2 ? '30px' : '38px')};

  .pc-AvatarStackBody {
    display: flex;
    position: absolute;
    width: var(--avatar-stack-three-plus-min-width);
  }

  .pc-AvatarItem {
    --avatar-size: var(--avatar-stack-size);
    flex-shrink: 0;
    height: var(--avatar-stack-size);
    width: var(--avatar-stack-size);
    box-shadow: 0 0 0 var(--avatar-border-width) ${get('colors.canvas.default')};
    position: relative;
    overflow: hidden;
    transition: margin 0.2s ease-in-out, opacity 0.2s ease-in-out, visibility 0.2s ease-in-out,
      box-shadow 0.1s ease-in-out;

    &:first-child {
      margin-left: 0;
      z-index: 10;
    }

    &:nth-child(n + 2) {
      margin-left: var(--avatar-two-margin);
      z-index: 9;
    }

    &:nth-child(n + 3) {
      margin-left: var(--avatar-three-margin);
      opacity: ${100 - 3 * 15}%;
      z-index: 8;
    }

    &:nth-child(n + 4) {
      opacity: ${100 - 4 * 15}%;
      z-index: 7;
    }

    &:nth-child(n + 5) {
      opacity: ${100 - 5 * 15}%;
      z-index: 6;
    }

    &:nth-child(n + 6) {
      opacity: 0;
      visibility: hidden;
    }
  }

  &.pc-AvatarStack--two {
    // this calc explained:
    // 1. avatar size + the non-overlapping part of the second avatar
    // 2. + the border widths of the first two avatars
    min-width: calc(
      var(--avatar-stack-size) + calc(var(--avatar-stack-size) + var(--avatar-two-margin)) + var(--avatar-border-width)
    );
  }

  &.pc-AvatarStack--three-plus {
    min-width: var(--avatar-stack-three-plus-min-width);
  }

  &.pc-AvatarStack--right {
    justify-content: flex-end;
    .pc-AvatarItem {
      margin-left: 0 !important;

      &:first-child {
        margin-right: 0;
      }

      &:nth-child(n + 2) {
        margin-right: var(--avatar-two-margin);
      }

      &:nth-child(n + 3) {
        margin-right: var(--avatar-three-margin);
      }
    }

    .pc-AvatarStackBody {
      flex-direction: row-reverse;

      &:hover {
        .pc-AvatarItem {
          margin-right: ${get('space.1')}!important;
          margin-left: 0 !important;

          &:first-child {
            margin-right: 0 !important;
          }
        }
      }
    }
  }

  .pc-AvatarStackBody:not(.pc-AvatarStack--disableExpand):hover {
    width: auto;

    .pc-AvatarItem {
      margin-left: ${get('space.1')};
      opacity: 100%;
      visibility: visible;
      box-shadow: 0 0 0 4px ${get('colors.canvas.default')};
      &:first-child {
        margin-left: 0;
      }
    }
  }

  ${sx};
`
const transformChildren = (children: React.ReactNode) => {
  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child
    return React.cloneElement(child, {
      ...child.props,
      className: clsx(child.props.className, 'pc-AvatarItem'),
    })
  })
}

export type AvatarStackProps = {
  alignRight?: boolean
  disableExpand?: boolean
  size?: number | ResponsiveValue<number>
  children: React.ReactNode
} & SxProp

const AvatarStack = ({children, alignRight, disableExpand, size, sx: sxProp = defaultSxProp}: AvatarStackProps) => {
  const count = React.Children.count(children)
  const wrapperClassNames = clsx({
    'pc-AvatarStack--two': count === 2,
    'pc-AvatarStack--three-plus': count > 2,
    'pc-AvatarStack--right': alignRight,
  })
  const bodyClassNames = clsx('pc-AvatarStackBody', {
    'pc-AvatarStack--disableExpand': disableExpand,
  })

  const getAvatarChildSizes = () => {
    const avatarSizeMap: Record<WidthOnlyViewportRangeKeys, number[]> = {
      narrow: [],
      regular: [],
      wide: [],
    }

    return React.Children.toArray(children).reduce<Record<WidthOnlyViewportRangeKeys, number>>(
      (acc, child) => {
        // if child is not an Avatar, return the default avatar sizes from the accumulator
        if (!React.isValidElement<AvatarProps>(child)) return acc

        for (const responsiveKey of Object.keys(avatarSizeMap)) {
          // if the child has responsive `size` prop values, push the value to the appropriate viewport property in the avatarSizeMap
          if (isResponsiveValue(child.props.size)) {
            avatarSizeMap[responsiveKey as WidthOnlyViewportRangeKeys].push(
              child.props.size[responsiveKey as WidthOnlyViewportRangeKeys] || DEFAULT_AVATAR_SIZE,
            )
          }
          // otherwise, the size is a number (or undefined), so push the value to all viewport properties in the avatarSizeMap
          else {
            avatarSizeMap[responsiveKey as WidthOnlyViewportRangeKeys].push(child.props.size || DEFAULT_AVATAR_SIZE)
          }

          // set the smallest size in each viewport property as the value for that viewport property in the accumulator
          acc[responsiveKey as WidthOnlyViewportRangeKeys] = Math.min(
            ...avatarSizeMap[responsiveKey as WidthOnlyViewportRangeKeys],
          )
        }

        return acc
      },
      {
        narrow: DEFAULT_AVATAR_SIZE,
        regular: DEFAULT_AVATAR_SIZE,
        wide: DEFAULT_AVATAR_SIZE,
      },
    )
  }

  const getResponsiveAvatarSizeStyles = () => {
    // if there is no size set on the AvatarStack, use the `size` props of the Avatar children to set the `--avatar-stack-size` CSS variable
    if (!size) {
      return getBreakpointDeclarations(
        getAvatarChildSizes(),
        '--avatar-stack-size' as keyof React.CSSProperties,
        value => `${value}px`,
      )
    }

    // if the `size` prop is set and responsive, set the `--avatar-stack-size` CSS variable for each viewport
    if (isResponsiveValue(size)) {
      return getBreakpointDeclarations(
        size,
        '--avatar-stack-size' as keyof React.CSSProperties,
        value => `${value || DEFAULT_AVATAR_SIZE}px`,
      )
    }

    // if the `size` prop is set and not responsive, it is a number, so we can just set the `--avatar-stack-size` CSS variable to that number
    return {'--avatar-stack-size': `${size}px`} as React.CSSProperties
  }

  const avatarStackSx = merge<BetterCssProperties | BetterSystemStyleObject>(
    getResponsiveAvatarSizeStyles(),
    sxProp as SxProp,
  )

  return (
    <AvatarStackWrapper count={count} className={wrapperClassNames} sx={avatarStackSx}>
      <Box className={bodyClassNames}> {transformChildren(children)}</Box>
    </AvatarStackWrapper>
  )
}

export default AvatarStack
