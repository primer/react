import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import styled, {css} from 'styled-components'
import {Check} from '@primer/octicons-react'
import {MenuContext} from './SelectMenuContext'
import {COMMON, get} from '../constants'
import StyledOcticon from '../StyledOcticon'
import theme from '../theme'
import sx from '../sx'

export const listItemStyles = css`
  display: flex;
  align-items: center;
  padding: ${get('space.3')};
  overflow: hidden;
  text-align: left;
  cursor: pointer;
  background-color: ${get('colors.white')};
  border: 0;
  border-bottom: ${get('borderWidths.1')} solid ${get('colors.border.grayLight')};
  color: ${get('colors.text.gray')};
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
  &:focus {
    outline: none;
  }

  &[hidden] {
    display: none !important;
  }

  @media (min-width: ${get('breakpoints.0')}) {
    padding-top: ${get('space.2')};
    padding-bottom: ${get('space.2')};
  }

  .SelectMenu-icon {
    width: ${get('space.3')};
    margin-right: ${get('space.2')};
    flex-shrink: 0;
  }

  .SelectMenu-selected-icon {
    visibility: hidden;
    transition: transform 0.12s cubic-bezier(0.5, 0.1, 1, 0.5), visibility 0s 0.12s linear;
    transform: scale(0);
  }

  // selected items
  &[aria-checked='true'] {
    font-weight: 500;
    color: ${get('colors.gray.9')};

    .SelectMenu-selected-icon {
      visibility: visible;
      transition: transform 0.12s cubic-bezier(0, 0, 0.2, 1), visibility 0s linear;
      transform: scale(1);
    }
  }

  // can hover states
  @media (hover: hover) {
    body:not(.intent-mouse) .SelectMenu-item:focus,
    &:hover,
    &:active,
    &:focus {
      background-color: ${get('colors.bg.gray')};
    }
  }

  // Can not hover states
  //
  // For touch input

  @media (hover: none) {
    // Android
    &:focus,
    &:active {
      background-color: ${get('colors.bg.grayLight')};
    }

    // iOS Safari
    // :active would work if ontouchstart is added to the button
    // Instead this tweaks the "native" highlight color
    -webkit-tap-highlight-color: rgba(${get('colors.gray.3')}, 0.5);
  }
`

const StyledItem = styled.a.attrs(() => ({
  role: 'menuitemcheckbox'
}))`
  ${listItemStyles}
  ${COMMON}
  ${sx};
`

// 'as' is spread out because we don't want users to be able to change the tag. using something
// other than 'a' will break a11y.
const SelectMenuItem = ({children, selected, theme, onClick, as, ...rest}) => {
  const menuContext = useContext(MenuContext)

  // close the menu when an item is clicked
  // this can be overriden if the user provides a `onClick` prop and prevents default in it
  const handleClick = e => {
    onClick && onClick(e)

    if (!e.defaultPrevented) {
      menuContext.setOpen(false)
    }
  }
  return (
    <StyledItem {...rest} theme={theme} onClick={handleClick} aria-checked={selected}>
      <StyledOcticon theme={theme} className="SelectMenu-icon SelectMenu-selected-icon" icon={Check} />
      {children}
    </StyledItem>
  )
}

SelectMenuItem.defaultProps = {
  theme,
  selected: false
}

SelectMenuItem.propTypes = {
  selected: PropTypes.bool,
  ...COMMON.propTypes,
  ...sx.propTypes
}

SelectMenuItem.displayName = 'SelectMenu.Item'

export default SelectMenuItem
