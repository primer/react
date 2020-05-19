import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import sx from './sx'
import {get, COMMON} from './constants'
import theme from './theme'
import {Absolute} from './Position'

const AvatarStackWrapper = styled.span`
  display: flex;
  position: relative;
  height: 20px;
  min-width: ${props => (props.count === 1 ? '20px' : props.count === 2 ? '30px' : '38px')};

  .pc-AvatarItem {
    flex-shrink: 0;
    height: 20px;
    width: 20px;
    box-shadow: 0 0 0 1px ${get('colors.white')};
    margin-left: -11px;
    position: relative;
    overflow: hidden;
    transition: margin 0.2s ease-in-out, opacity 0.2s ease-in-out, visibility 0.2s ease-in-out,
      box-shadow 0.1s ease-in-out;

    &:first-child {
      margin-left: 0;
    }
    &:nth-child(n + 4) {
      display: none;
    }
  }

  &.pc-AvatarStack--two {
    min-width: 30px;
    .pc-AvatarItem {
      &:nth-child(n + 3) {
        display: none;
      }
    }
  }

  &.pc-AvatarStack--three-plus {
    min-width: 38px;
    .pc-AvatarItem {
      &:nth-child(3) {
        opacity: ${100 - 3 * 15}%;
        margin-left: -17px;
      }
      &:nth-child(4) {
        opacity: ${100 - 4 * 15}%;
        margin-left: -17px;
      }
      &:nth-child(5) {
        opacity: ${100 - 5 * 15}%;
        margin-left: -17px;
      }
      &:nth-child(n + 4) {
        display: block;
      }
      &:nth-child(n + 6) {
        opacity: 0;
        visibility: hidden;
      }
    }
  }

  &.pc-AvatarStack--right {
    justify-content: flex-end;
    .pc-AvatarItem {
      margin-left: 0 !important;
      margin-right: -11px;

      &:first-child {
        margin-right: 0;
      }
    }

    .pc-AvatarStackBody {
      flex-direction: row-reverse;

      &:hover {
        .pc-AvatarItem {
          margin-right: ${get('space.1')}!important;
          margin-left: 0 !important;

          &:first-child {
            margin-right: 0!important;
          }
        }
      }
    }
  }

  &.pc-AvatarStack--three-plus.pc-AvatarStack--right {
    .pc-AvatarItem {
      &:nth-child(3) {
        margin-right: -17px;
      }
      &:nth-child(4) {
        margin-right: -17px;
      }
      &:nth-child(5) {
        margin-right: -17px;
      }
    }
  }

  .pc-AvatarStackBody:hover {
    width: auto;

    .pc-AvatarItem {
      margin-left: ${get('space.1')};
      opacity: 100%;
      visibility: visible;
      box-shadow: 0 0 0 4px ${get('colors.white')};
      &:first-child {
        margin-left: 0;
      }
    }
  }

  ${COMMON}
  ${sx};
`
const transformChildren = children => {
  return React.Children.map(children, (child, index) => {
    return React.cloneElement(child, {
      className: classnames(child.props.className, 'pc-AvatarItem'),
      sx: {zIndex: 10 - index, ...child.props.sx}
    })
  })
}

const AvatarStack = ({children = [], alignRight, ...rest}) => {
  const count = children.length
  const wrapperClassNames = classnames({
    'pc-AvatarStack--two': count === 2,
    'pc-AvatarStack--three-plus': count > 2,
    'pc-AvatarStack--right': alignRight
  })
  return (
    <AvatarStackWrapper count={count} className={wrapperClassNames} {...rest}>
      <Absolute display="flex" width="38px" className="pc-AvatarStackBody">
        {transformChildren(children)}
      </Absolute>
    </AvatarStackWrapper>
  )
}

AvatarStack.defaultProps = {
  theme
}

AvatarStack.propTypes = {
  ...COMMON.propTypes,
  alignRight: PropTypes.bool,
  ...sx.propTypes
}
export default AvatarStack
