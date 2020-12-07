import React from 'react'
import styled from 'styled-components'
import theme from './theme'
import {COMMON, get} from './constants'
import sx from './sx'

const StyledLabelGroup = styled.span`
  ${COMMON}
  & * {
    margin-right: ${get('space.1')};
  }
  & *:last-child {
    margin-right: 0;
  }
  ${sx};
`

const LabelGroup = ({children, ...rest}) => <StyledLabelGroup {...rest}>{children}</StyledLabelGroup>

LabelGroup.defaultProps = {
  theme,
}

LabelGroup.propTypes = {
  ...COMMON.propTypes,
  ...sx.propTypes,
}

export default LabelGroup
