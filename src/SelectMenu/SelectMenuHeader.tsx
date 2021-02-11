import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {get, COMMON, TYPOGRAPHY, SystemCommonProps, SystemTypographyProps} from '../constants'
import theme from '../theme'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'

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

const StyledHeader = styled.header<SystemTypographyProps & SystemCommonProps & SxProp>`
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

SelectMenuHeader.defaultProps = {
  theme
}

SelectMenuHeader.propTypes = {
  theme: PropTypes.object,
  ...COMMON.propTypes,
  ...TYPOGRAPHY.propTypes,
  ...sx.propTypes
}

SelectMenuHeader.displayName = 'SelectMenu.Header'

export default SelectMenuHeader
