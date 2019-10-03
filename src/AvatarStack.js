import React from 'react'
import styled from 'styled-components'
import {get, COMMON} from './constants'

const rightStyles = `
  .body {
    right: 0;
    flex-direction: row-reverse;

    &:hover .avatar {
      margin-right: 0;
      margin-left: 3px;
    }
  }

  .avatar.avatar-more {
    background: ${get('colors.gray.3')};

    &::before {
      width: 5px;
    }

    &::after {
      width: 2px;
      background: ${get('colors.gray.1')};
    }
  }

  .avatar {
    margin-right: 0;
    margin-left: -11px;
    border-right: 0;
    border-left: ${get('borders.1')} solid ${get('colors.white')};
  }
`

const Item = styled.img.attrs(props => ({
  className: 'avatar'
}))`
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
        {child}
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
  ${COMMON}
  ${props => (props.alignRight ? rightStyles : '')}
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
    <AvatarStackWrapper count={children.length} {...rest}>
      <AvatarStackBody className="body">{transformChildren(children)}</AvatarStackBody>
    </AvatarStackWrapper>
  )
}

AvatarStack.Item = Item

export default AvatarStack
