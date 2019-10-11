import React from 'react'
import styled from 'styled-components'
import theme from './theme'
import classnames from 'classnames'
import {COMMON, get} from './constants'

const transformChildren = children => {
  return React.Children.map(children, child => {
    const classes = classnames(child.props['className'], 'LabelItem')
    return React.cloneElement(child, {className: classes})
  })
}

const StyledLabelGroup = styled.span`
  ${COMMON}
  & .LabelItem {
    margin-right: ${get('space.1')}px;
  }
  & .LabelItem:last-child {
    margin-right: 0;
  }
`

const LabelGroup = ({children, ...rest}) => <StyledLabelGroup {...rest}>{transformChildren(children)}</StyledLabelGroup>

LabelGroup.defaultProps = {
  theme
}

LabelGroup.propTypes = {
  ...COMMON.propTypes
}

export default LabelGroup
