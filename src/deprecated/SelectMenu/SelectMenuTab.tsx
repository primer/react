import clsx from 'clsx'
import React, {useContext, useEffect} from 'react'
import styled, {css} from 'styled-components'
import {get} from '../../constants'
import sx, {SxProp} from '../../sx'
import {ComponentProps} from '../../utils/types'
import {MenuContext} from './SelectMenuContext'

const tabStyles = css`
  flex: 1;
  padding: ${get('space.2')} ${get('space.3')};
  font-size: ${get('fontSizes.0')};
  font-weight: 500;
  color: ${get('colors.fg.muted')};
  text-align: center;
  background-color: transparent;
  border: 0;
  box-shadow: inset 0 -1px 0 ${get('colors.border.muted')};

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
    color: ${get('colors.text-primary')};
    background-color: ${get('colors.canvas.overlay')};
    box-shadow: 0 0 0 1px ${get('colors.border.muted')};

    @media (min-width: ${get('breakpoints.0')}) {
      border-color: ${get('colors.border.muted')};
      box-shadow: none;
    }
  }

  &:focus {
    background-color: ${get('colors.neutral.subtle')};
  }
`

const StyledTab = styled.button<SxProp>`
  ${tabStyles}
  ${sx};
`

export type SelectMenuTabProps = {tabName?: string; index?: number} & ComponentProps<typeof StyledTab>

const SelectMenuTab = ({tabName = '', index, className, onClick, ...rest}: SelectMenuTabProps) => {
  const menuContext = useContext(MenuContext)
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // if consumer has attached an onClick event, call it
    onClick && onClick(e)
    if (!e.defaultPrevented) {
      menuContext.setSelectedTab?.(tabName)
    }
  }

  // if no tab is selected when the component renders, show the first tab
  useEffect(() => {
    if (!menuContext.selectedTab && index === 0) {
      menuContext.setSelectedTab?.(tabName)
    }
  }, [index, menuContext, tabName])

  const isSelected = menuContext.selectedTab === tabName

  return (
    <StyledTab
      role="tab"
      className={clsx('SelectMenuTab', className)}
      aria-selected={isSelected}
      onClick={handleClick}
      {...rest}
    >
      {tabName}
    </StyledTab>
  )
}

SelectMenuTab.displayName = 'SelectMenu.Tab'

export default SelectMenuTab
