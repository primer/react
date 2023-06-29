import classnames from 'classnames'
import React from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import Box from '../Box'
import sx, {SxProp} from '../sx'
import {AvatarProps, DEFAULT_AVATAR_SIZE} from '../Avatar/Avatar'

type StyledAvatarStackWrapperProps = {
  count?: number
} & SxProp

const findSmallestNumber = (numbers: number[]): number => {
  let smallestNumber = numbers[0]
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] < smallestNumber) {
      smallestNumber = numbers[i]
    }
  }
  return smallestNumber
}

const AvatarStackWrapper = styled.span<StyledAvatarStackWrapperProps>`
  --avatar-border-width: 1px;
  --avatar-two-margin: calc(var(--avatar-size) * -0.55);
  --avatar-three-margin: calc(var(--avatar-size) * -0.85);

  // this calc explained:
  // 1. avatar size + the non-overlapping part of the second avatar
  // 2. + the non-overlapping part of the second and third avatar
  // 3. + the border widths of all previous avatars
  --avatar-stack-three-plus-min-width: calc(
    var(--avatar-size) +
      calc(
        calc(var(--avatar-size) + var(--avatar-two-margin)) + calc(var(--avatar-size) + var(--avatar-three-margin)) * 2
      ) + calc(var(--avatar-border-width) * 3)
  );
  display: flex;
  position: relative;
  height: var(--avatar-size);
  min-width: ${props => (props.count === 1 ? 'var(--avatar-size)' : props.count === 2 ? '30px' : '38px')};

  .pc-AvatarStackBody {
    display: flex;
    position: absolute;
    width: var(--avatar-stack-three-plus-min-width);
  }

  .pc-AvatarItem {
    flex-shrink: 0;
    height: var(--avatar-size);
    width: var(--avatar-size);
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
      var(--avatar-size) + calc(var(--avatar-size) + var(--avatar-two-margin)) + var(--avatar-border-width)
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
      className: classnames(child.props.className, 'pc-AvatarItem'),
    })
  })
}

export type AvatarStackProps = {
  alignRight?: boolean
  disableExpand?: boolean
  size?: number
  children: React.ReactNode
} & SxProp

const AvatarStack = ({
  children,
  alignRight,
  disableExpand,
  size = DEFAULT_AVATAR_SIZE,
  sx: sxProp,
}: AvatarStackProps) => {
  const count = React.Children.count(children)
  const wrapperClassNames = classnames({
    'pc-AvatarStack--two': count === 2,
    'pc-AvatarStack--three-plus': count > 2,
    'pc-AvatarStack--right': alignRight,
  })
  const bodyClassNames = classnames('pc-AvatarStackBody', {
    'pc-AvatarStack--disableExpand': disableExpand,
  })

  const avatarSizes = React.Children.map(children, child => {
    if (!React.isValidElement<AvatarProps>(child)) return size

    return child.props.size ? child.props.size : size
  })

  return (
    <AvatarStackWrapper
      count={count}
      className={wrapperClassNames}
      sx={sxProp}
      style={{'--avatar-size': `${findSmallestNumber(avatarSizes || [])}px`} as React.CSSProperties}
    >
      <Box className={bodyClassNames}> {transformChildren(children)}</Box>
    </AvatarStackWrapper>
  )
}

export default AvatarStack
