import React from 'react'
import styled from 'styled-components'
import theme from './theme'
import {COMMON, get} from './constants'
import sx from './sx'

const transformChildren = children => {
  return React.Children.map(children, child => {
    return React.cloneElement(child, {className: 'LabelItem'})
  })
}

const StyledLabelGroup = styled.span`
  ${COMMON}
  & .LabelItem {
    margin-right: ${get('space.1')};
  }
  & .LabelItem:last-child {
    margin-right: 0;
  }
  ${sx};
`

const LabelGroup = ({children, ...rest}) => <StyledLabelGroup {...rest}>{transformChildren(children)}</StyledLabelGroup>

LabelGroup.defaultProps = {
  theme
}

LabelGroup.propTypes = {
  ...COMMON.propTypes,
  ...sx.propTypes
}

export default LabelGroup
