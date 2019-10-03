import React from 'react'
import styled from 'styled-components'
import {get} from './constants'
import uuid from 'uuid'

const AvatarChild = styled.img`
  position: relative;
  z-index: 2;
  display: flex;
  width: 20px;
  height: 20px;
  box-sizing: content-box;
  margin-right: -11px;
  background-color: ${get('colors.white')};
  border-right: ${get('borders.1')} solid ${get('colors.white')};
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
  }

  // Account for 4+ avatars
  &:nth-child(n+4) {
    display: none;
    opacity: 0;
  }
`
const transformChildren = children => {
  const count = children.length
  const newChildren = React.Children.map(children, (child, index) => {
    return (
      <>
        {count > 3 && index === 2 && <div className="avatar-more" />}
        <AvatarChild className="avatar" key={uuid()} {...child.props}>
          {child.children}
        </AvatarChild>
      </>
    )
  })
  return newChildren
}

const AvatarStackWrapper = styled.span`
  display: inline-block;
  position: relative;
  min-width: ${props => (props.count === 1 ? '26px' : props.count === 2 ? '36px' : '46px')};
  height: 20px;
`

const AvatarStackBody = styled.span`
  display: flex;
  position: absolute;
  background: white;

  &:hover {
    .avatar {
      margin-right: 3px;
    }

    .avatar:nth-child(n+4) {
      display: flex;
      opacity: 1;
    }

    .avatar-more {
      display: none !important;
    }
  }

  .avatar-more {
    z-index: 1;
    margin-right: 0;
    background: ${get('colors.gray.2')};

    &::before,
    &::after {
      position: absolute;
      display: block;
      height: 20px;
      content: '';
      border-radius: 2px;
      outline: ${get('borders.1')} solid ${get('colors.white')};
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
`
const AvatarStack = ({children, ...rest}) => {
  return (
    <AvatarStackWrapper count={children.length}>
      <AvatarStackBody>{transformChildren(children)}</AvatarStackBody>
    </AvatarStackWrapper>
  )
}

export default AvatarStack
