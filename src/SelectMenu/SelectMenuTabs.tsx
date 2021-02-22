import React from 'react'
import styled, {css} from 'styled-components'
import {COMMON, get, SystemCommonProps} from '../constants'
import theme from '../theme'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'

const tabWrapperStyles = css`
  display: flex;
  flex-shrink: 0;
  margin-bottom: -1px; // hide border of element below
  -webkit-overflow-scrolling: touch;
  overflow-x: auto;
  overflow-y: hidden;

  // Hide scrollbar so it doesn't cover the text
  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: ${get('breakpoints.0')}) {
    padding: 0 ${get('space.2')};
    margin-top: ${get('space.3')};
  }
`

const SelectMenuTabsBase = styled.div<SystemCommonProps & SxProp>`
  ${tabWrapperStyles}
  ${COMMON}
  ${sx};
`

export type SelectMenuTabsProps = ComponentProps<typeof SelectMenuTabsBase>

const SelectMenuTabs = ({children, ...rest}: SelectMenuTabsProps) => {
  return (
    <SelectMenuTabsBase role="tablist" {...rest}>
      {children}
    </SelectMenuTabsBase>
  )
}

SelectMenuTabs.defaultProps = {
  theme
}

SelectMenuTabs.propTypes = {
  ...COMMON.propTypes,
  ...sx.propTypes
}

SelectMenuTabs.displayName = 'SelectMenu.Tabs'

export default SelectMenuTabs
