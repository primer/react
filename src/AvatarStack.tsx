import classnames from 'classnames'
import React from 'react'
import styled from 'styled-components'
import {get} from './constants'
import {Box} from '.'
import sx, {SxProp} from './sx'

type StyledAvatarStackWrapperProps = {
  count?: number
} & SxProp

const AvatarStackWrapper = styled.span<StyledAvatarStackWrapperProps>`
  display: flex;
  position: relative;
  height: 20px;
  min-width: ${props => (props.count === 1 ? '20px' : props.count === 2 ? '30px' : '38px')};

  .pc-AvatarItem {
    flex-shrink: 0;
    height: 20px;
    width: 20px;
    box-shadow: 0 0 0 1px ${get('colors.canvas.default')};
    position: relative;
    overflow: hidden;
    transition: margin 0.2s ease-in-out, opacity 0.2s ease-in-out, visibility 0.2s ease-in-out,
      box-shadow 0.1s ease-in-out;

    &:first-child {
      margin-left: 0;
      z-index: 10;
    }

    &:nth-child(n + 2) {
      margin-left: -11px;
      z-index: 9;
    }

    &:nth-child(n + 3) {
      margin-left: -17px;
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
    min-width: 30px;
  }

  &.pc-AvatarStack--three-plus {
    min-width: 38px;
  }

  &.pc-AvatarStack--right {
    justify-content: flex-end;
    .pc-AvatarItem {
      margin-left: 0 !important;

      &:first-child {
        margin-right: 0;
      }

      &:nth-child(n + 2) {
        margin-right: -11px;
      }

      &:nth-child(n + 3) {
        margin-right: -17px;
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

  .pc-AvatarStackBody:hover {
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
      className: classnames(child.props.className, 'pc-AvatarItem')
    })
  })
}

export type AvatarStackProps = {
  alignRight?: boolean
  children: React.ReactNode
} & SxProp

const AvatarStack = ({children, alignRight, sx: sxProp}: AvatarStackProps) => {
  const count = React.Children.count(children)
  const wrapperClassNames = classnames({
    'pc-AvatarStack--two': count === 2,
    'pc-AvatarStack--three-plus': count > 2,
    'pc-AvatarStack--right': alignRight
  })
  return (
    <AvatarStackWrapper count={count} className={wrapperClassNames} sx={sxProp}>
      <Box position="absolute" display="flex" width="38px" className="pc-AvatarStackBody">
        {transformChildren(children)}
      </Box>
    </AvatarStackWrapper>
  )
}

export default AvatarStack
