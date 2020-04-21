import React from 'react'
import styled, {css} from 'styled-components'
import {COMMON, get} from '../constants'
import theme from '../theme'
import sx from '../sx'

const tabWrapperStyles = css`
  display: flex;
  flex-shrink: 0;
  margin-bottom: -1px; // hide border of element below
  border-top: ${get('borderWidths.1')} solid ${get('colors.border.gray')};
  -webkit-overflow-scrolling: touch;

  // Hide scrollbar so it doesn't cover the text
  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: ${get('breakpoints.0')}) {
    padding: 0 ${get('space.2')};
    border-top: 0;
  }
`

const Tabs = ({children, ...rest}) => {
  return (
    <div role="tablist" {...rest}>
      {children}
    </div>
  )
}

const SelectMenuTabs = styled(Tabs)`
  ${tabWrapperStyles}
  ${COMMON}
  ${sx};
`

SelectMenuTabs.defaultProps = {
  theme
}

SelectMenuTabs.propTypes = {
  ...COMMON.propTypes,
  ...sx.propTypes
}

SelectMenuTabs.displayName = 'SelectMenu.Tabs'

export default SelectMenuTabs
