import React, {useContext, useEffect} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import styled, {css} from 'styled-components'
import {MenuContext} from './SelectMenuContext'
import {get, COMMON} from '../constants'
import theme from '../theme'
import sx from '../sx'

const tabStyles = css`
  flex: 1;
  padding: ${get('space.2')} ${get('space.3')};
  font-size: ${get('fontSizes.0')};
  font-weight: 500;
  color: ${get('colors.gray.5')};
  text-align: center;
  background-color: transparent;
  border: 0;
  box-shadow: inset 0 -1px 0 ${get('colors.border.gray')};

  @media (min-width: ${get('breakpoints.0')}) {
    flex: none;
    padding: ${get('space.1')} ${get('space.3')};
    border: ${get('borderWidths.1')} solid transparent;
    border-bottom-width: 0;
    border-top-left-radius: ${get('radii.2')};
    border-top-right-radius: ${get('radii.2')};
  }

  &[aria-selected='true'] {
    z-index: 1; // Keeps box-shadow visible when hovering
    color: ${get('colors.gray.9')};
    background-color: ${get('colors.white')};
    box-shadow: 0 0 0 1px ${get('colors.border.gray')};

    @media (min-width: ${get('breakpoints.0')}) {
      border-color: ${get('colors.border.gray')};
      box-shadow: none;
    }
  }

  &:focus {
    background-color: #dbedff;
  }
`

const StyledTab = styled.button`
  ${tabStyles}
  ${COMMON}
  ${sx};
`

const SelectMenuTab = ({tabName, index, className, onClick, ...rest}) => {
  const menuContext = useContext(MenuContext)
  const handleClick = e => {
    // if consumer has attached an onClick event, call it
    onClick && onClick(e)
    if (!e.defaultPrevented) {
      menuContext.setSelectedTab(tabName)
    }
  }

  // if no tab is selected when the component renders, show the first tab
  useEffect(() => {
    if (!menuContext.selectedTab && index === 0) {
      menuContext.setSelectedTab(tabName)
    }
  }, [index, menuContext, tabName])

  const isSelected = menuContext.selectedTab === tabName

  return (
    <StyledTab
      role="tab"
      className={classnames('SelectMenuTab', className)}
      aria-selected={isSelected}
      onClick={handleClick}
      {...rest}
    >
      {tabName}
    </StyledTab>
  )
}

SelectMenuTab.defaultProps = {
  theme
}

SelectMenuTab.propTypes = {
  index: PropTypes.number,
  onClick: PropTypes.func,
  tabName: PropTypes.string,
  ...COMMON.propTypes,
  ...sx.propTypes
}

SelectMenuTab.displayName = 'SelectMenu.Tab'

export default SelectMenuTab
