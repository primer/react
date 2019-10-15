import React from 'react'
import styled from 'styled-components'
import {get, COMMON, TYPOGRAPHY} from './constants'
import theme from './theme'

const SelectMenuTitle = styled.h3`
  flex: auto;
  font-size: ${get('fontSizes.1')}px;
  font-weight: ${get('fontWeights.bold')};
  margin: 0;

  @media (min-width: ${get('breakpoints.0')}) {
    font-size: inherit;
  }
`

SelectMenuTitle.defaultProps = {
  theme
}

const StyledHeader = styled.header`
  display: flex;
  flex: none; // fixes header from getting squeezed in Safari iOS
  padding: ${get('space.3')}px;
  ${COMMON}
  ${TYPOGRAPHY}

  @media (min-width: ${get('breakpoints.0')}) {
    padding-top: ${get('space.2')}px;
    padding-bottom: ${get('space.2')}px;
  }
`
const SelectMenuHeader = ({children, ...rest}) => {
  return (
    <StyledHeader {...rest}>
      <SelectMenuTitle>
        {children}
      </SelectMenuTitle>
    </StyledHeader>
  )
}

SelectMenuHeader.defaultProps = {
  theme
}

export default SelectMenuHeader