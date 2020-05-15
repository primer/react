import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import sx from './sx'
import {get, COMMON} from './constants'
import theme from './theme'

const transformChildren = children => {
  return React.Children.map(children, (child, index) => {
    return <>{React.cloneElement(child, {className: 'AvatarItem', sx: {zIndex: 10 - index}})}</>
  })
}

const AvatarStackWrapper = styled.span`
  display: flex;
  position: relative;
  height: 20px;
  min-width: ${props => (props.count === 1 ? '20px' : props.count === 2 ? '30px' : '38px')};

  .AvatarItem {
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

  &.AvatarStack--two {
    min-width: 30px;
    .AvatarItem {
      &:nth-child(n + 3) {
        display: none;
      }
    }
  }

  &.AvatarStack--three-plus {
    min-width: 38px;
    .AvatarItem {
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

  &.AvatarStack--right {
    justify-content: flex-end;
    .AvatarItem {
      margin-left: 0 !important;
      margin-right: -11px;

      &:first-child {
        margin-right: 0;
      }
    }

    .AvatarStackBody {
      flex-direction: row-reverse;

      &:hover {
        .AvatarItem {
          margin-right: ${get('space.1')}!important;
          margin-left: 0 !important;

          &:first-child {
            margin-right: 0;
          }
        }
      }
    }
  }

  &.AvatarStack--three-plus.AvatarStack--right {
    .AvatarItem {
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

  ${COMMON}
  ${sx};
`

const AvatarStackBody = styled.span`
  display: flex;
  position: absolute;
  width: 38px;

  &:hover {
    width: auto;

    .AvatarItem {
      margin-left: ${get('space.1')}!important;
      opacity: 100% !important;
      visibility: visible;
      box-shadow: 0 0 0 4px ${get('colors.white')};
      &:first-child {
        margin-left: 0;
      }
    }
  }
`
const AvatarStack = ({children = [], alignRight, ...rest}) => {
  const count = children.length
  const wrapperClassNames = classnames(
    count === 2 ? 'AvatarStack--two' : count > 2 ? 'AvatarStack--three-plus' : '',
    alignRight ? 'AvatarStack--right' : ''
  )
  return (
    <AvatarStackWrapper count={count} className={wrapperClassNames} {...rest}>
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
