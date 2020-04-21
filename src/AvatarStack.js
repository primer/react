import React from 'react'
import PropTypes from 'prop-types'
import styled, {css} from 'styled-components'
import sx from './sx'
import {get, COMMON} from './constants'
import theme from './theme'

const transformChildren = children => {
  const count = children.length
  return React.Children.map(children, (child, index) => {
    return (
      <>
        {count > 3 && index === 2 && <div className="AvatarItem-more AvatarItem" />}
        {React.cloneElement(child, {className: 'AvatarItem'})}
      </>
    )
  })
}

const AvatarStackWrapper = styled.span`
  display: inline-block;
  position: relative;
  min-width: ${props => (props.count === 1 ? '26px' : props.count === 2 ? '36px' : '46px')};
  height: 20px;
  ${COMMON}
  ${sx};
`

const AvatarStackBody = styled.span`
  display: flex;
  position: absolute;
  background: white;

  &:hover {
    .AvatarItem {
      margin-right: 3px;
    }

    .AvatarItem:nth-child(n + 4) {
      display: flex;
      opacity: 1;
    }

    .AvatarItem-more {
      display: none !important;
    }
  }

  .AvatarItem {
    position: relative;
    z-index: 2;
    display: flex;
    width: 20px;
    height: 20px;
    box-sizing: content-box;
    margin-right: -11px;
    background-color: ${get('colors.white')};
    border-right: ${get('borderWidths.1')} solid ${get('colors.white')};
    border-radius: 2px;
    transition: margin 0.1s ease-in-out;

    &:first-child {
      z-index: 3;
    }

    &:last-child {
      z-index: 1;
      border-right: 0;
    }

    img {
      border-radius: 2px;
      width: inherit;
    }

    // Account for 4+ avatars
    &:nth-child(n + 4) {
      display: none;
      opacity: 0;
    }
  }

  .AvatarItem-more {
    z-index: 1;
    margin-right: 0;
    background: ${get('colors.gray.1')};

    &::before,
    &::after {
      position: absolute;
      display: block;
      height: 20px;
      content: '';
      border-radius: 2px;
      outline: ${get('borderWidths.1')} solid ${get('colors.white')};
    }

    &::before {
      width: 17px;
      background: ${get('colors.gray.2')};
    }

    &::after {
      width: 14px;
      background: ${get('colors.gray.3')};
    }
  }

  ${props =>
    props.alignRight &&
    css`
      right: 0;
      flex-direction: row-reverse;

      &:hover .AvatarItem {
        margin-right: 0;
        margin-left: 3px;
      }

      .AvatarItem-more {
        background: ${get('colors.gray.3')};

        &::before {
          width: 5px;
        }

        &::after {
          background: ${get('colors.gray.1')};
          width: 2px;
        }
      }

      .AvatarItem {
        margin-right: 0;
        margin-left: -11px;
        border-right: 0;
        border-left: ${get('borderWidths.1')} solid ${get('colors.white')};
      }
    `}
`
const AvatarStack = ({children = [], alignRight, ...rest}) => {
  return (
    <AvatarStackWrapper count={children.length} {...rest}>
      <AvatarStackBody alignRight={alignRight} className="AvatarStackBody">
        {transformChildren(children)}
      </AvatarStackBody>
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
