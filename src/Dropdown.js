import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Button from './Button'
import Details from './Details'
import {COMMON, get} from './constants'
import getDirectionStyles from './DropdownStyles'
import theme from './theme'

const Dropdown = styled(Details)`
  position: relative;
  display: inline-block;
  ${COMMON};
`

const DropdownCaret = styled.div`
  border: 4px solid transparent;
  border-top-color: currentcolor;
  content: '';
  display: inline-block;
  height: 0;
  vertical-align: middle;
  width: 0;
`

const DropdownButton = ({children, ...rest}) => {
  return (
    <Button is="summary" aria-haspopup="true" {...rest}>
      {children}
      <DropdownCaret />
    </Button>
  )
}

const DropdownMenu = styled.ul`
  background-clip: padding-box;
  background-color: #fff;
  border: 1px solid rgba(27, 31, 35, 0.15);
  border-radius: 4px;
  box-shadow: 0 3px 12px rgba(27, 31, 35, 0.15);
  left: 0;
  list-style: none;
  margin-top: 2px;
  padding: 5px 0 5px 0 !important; //TODO: fix this override on our markdown styles
  position: absolute;
  top: 100%;
  width: 160px;
  z-index: 100;

  &::before {
    position: absolute;
    display: inline-block;
    content: '';
  }

  &::after {
    position: absolute;
    display: inline-block;
    content: '';
  }

  &::before {
    border: 8px solid transparent;
    border-bottom-color: ${get('colors.blackFade15')};
  }

  &::after {
    border: 7px solid transparent;
    border-bottom-color: ${get('colors.white')};
  }

  // stylelint-disable-next-line selector-max-type
  > ul {
    list-style: none;
  }
  ${props => (props.direction ? getDirectionStyles(props.theme, props.direction) : '')};
  ${COMMON};
`

const DropdownItem = styled.li`
  display: block;
  padding: ${get('space.1')}px 10px ${get('space.1')}px 15px;
  overflow: hidden;
  color: $get('colors.gray.9');
  text-overflow: ellipsis;
  white-space: nowrap;

  &:focus {
    color: ${get('colors.white')};
    text-decoration: none;
    background-color: ${get('colors.blue.5')};
  }

  &:hover {
    color: ${get('colors.white')}
    text-decoration: none;
    background-color: ${get('colors.blue.5')};
    outline: none;
  }
  ${COMMON}
`

Dropdown.Button = styled(DropdownButton)(COMMON)
Dropdown.Menu = DropdownMenu
Dropdown.Item = DropdownItem

Dropdown.Menu.propTypes = {
  direction: PropTypes.oneOf(['ne', 'e', 'se', 's', 'sw', 'w']),
  ...COMMON.propTypes
}

Dropdown.Menu.defaultProps = {
  direction: 'sw',
  theme
}

Dropdown.defaultProps = {theme}
Dropdown.propTypes = {
  children: PropTypes.node,
  ...COMMON.propTypes
}

Dropdown.Button.defaultProps = {theme}
Dropdown.Button.propTypes = {
  ...COMMON.propTypes
}

Dropdown.Item.defaultProps = {theme}
Dropdown.Item.propTypes = {
  ...COMMON.propTypes
}

export default Dropdown
