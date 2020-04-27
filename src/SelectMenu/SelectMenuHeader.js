import React from 'react'
import styled from 'styled-components'
import {get, COMMON, TYPOGRAPHY} from '../constants'
import theme from '../theme'

// SelectMenu.Header is intentionally not exported, it's an internal component used in
// SelectMenu.Modal

const SelectMenuTitle = styled.h3`
  flex: auto;
  font-size: ${get('fontSizes.1')};
  font-weight: ${get('fontWeights.bold')};
  margin: 0;

  @media (min-width: ${get('breakpoints.0')}) {
    font-size: inherit;
  }
`

const StyledHeader = styled.header`
  display: flex;
  flex: none; // fixes header from getting squeezed in Safari iOS
  padding: ${get('space.3')};
  border-bottom: ${get('borderWidths')} solid ${get('colors.border.gray')};
  ${COMMON}
  ${TYPOGRAPHY}

  @media (min-width: ${get('breakpoints.0')}) {
    padding-top: ${get('space.2')};
    padding-bottom: ${get('space.2')};
  }
`
const SelectMenuHeader = ({children, theme, ...rest}) => {
  return (
    <StyledHeader theme={theme} {...rest}>
      <SelectMenuTitle theme={theme}>{children}</SelectMenuTitle>
    </StyledHeader>
  )
}

SelectMenuHeader.defaultProps = {
  theme
}

export default SelectMenuHeader
