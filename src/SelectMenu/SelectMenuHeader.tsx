import React from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'

// SelectMenu.Header is intentionally not exported, it's an internal component used in
// SelectMenu.Modal

const SelectMenuTitle = styled.h3`
  color: ${get('colors.fg.default')};
  flex: auto;
  font-size: ${get('fontSizes.1')};
  font-weight: ${get('fontWeights.bold')};
  margin: 0;

  @media (min-width: ${get('breakpoints.0')}) {
    font-size: inherit;
  }
`

const StyledHeader = styled.header<SxProp>`
  display: flex;
  flex: none; // fixes header from getting squeezed in Safari iOS
  padding: ${get('space.3')};
  border-bottom: ${get('borderWidths')} solid ${get('colors.border.muted')};

  @media (min-width: ${get('breakpoints.0')}) {
    padding-top: ${get('space.2')};
    padding-bottom: ${get('space.2')};
  }

  ${sx};
`

export type SelectMenuHeaderProps = ComponentProps<typeof StyledHeader>

const SelectMenuHeader = ({children, theme, ...rest}: SelectMenuHeaderProps) => {
  return (
    <StyledHeader theme={theme} {...rest}>
      <SelectMenuTitle theme={theme}>{children}</SelectMenuTitle>
    </StyledHeader>
  )
}

SelectMenuHeader.displayName = 'SelectMenu.Header'

export default SelectMenuHeader
