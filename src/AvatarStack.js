import React from 'react'
import styled from 'styled-components'

const transformChildren = children => {
  const newChildren = children.map(child => {
    React.cloneElement(child, {mr: '-11'})
  })
  return newChildren
}

const AvatarStackWrapper = styled.span`
  position: relative;
  min-width: 26px;
  height: 20px;
`

const AvatarStackBody = styled.span`
  display: flex;
  position: absolute;
  background: white;
`
const AvatarStack = ({children, ...rest}) => {
  return(
    <AvatarStackWrapper>
      <AvatarStackBody>
        {transformChildren(children)}
      </AvatarStackBody>
    </AvatarStackWrapper>
  ) 
  
}

export default AvatarStack
