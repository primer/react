import React from 'react'
import styled from 'styled-components'
import theme from './theme'
import {COMMON} from './constants'

const transformChildren = children => {
  return React.Children.map(children, child => {
    return React.cloneElement(child, {mr: 1, className: 'LabelItem'})
  })
}

const LabelGroup = styled.span.attrs(props => ({
  children: transformChildren(props.children)
}))`
  ${COMMON}
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
