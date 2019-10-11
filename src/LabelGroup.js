import React from 'react'
import styled from 'styled-components'
import theme from './theme'
import {COMMON, get} from './constants'

const transformChildren = children => {
  return React.Children.map(children, child => {
    return React.cloneElement(child, {className: 'LabelItem'})
  })
}

const LabelGroup = styled.span.attrs(props => ({
  children: transformChildren(props.children)
}))`
  ${COMMON}
  & .LabelItem {
    margin-right: ${get('space.1')}px;
  }
  & .LabelItem:last-child {
    margin-right: 0;
  }
`

LabelGroup.defaultProps = {
  theme
}

LabelGroup.propTypes = {
  ...COMMON.propTypes
}

export default LabelGroup
