import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Button from './Button'
import Details from './Details'
import {COMMON, get} from './constants'
import getDirectionStyles from './DropdownStyles'
import theme from './theme'

const StyledDetails = styled(Details)`
  position: relative;
  display: inline-block;
`

const Dropdown = ({children, className, ...rest}) => {
  return (
    <StyledDetails overlay className={className} {...rest}>
      {children}
    </StyledDetails>
  )
}

Dropdown.Button = ({children, ...rest}) => {
  return (
    <Button as="summary" aria-haspopup="true" {...rest}>
      {children}
      <Dropdown.Caret />
    </Button>
  )
}

Dropdown.Caret = styled.div`
  border: 4px solid transparent;
  margin-left: 12px;
  border-top-color: currentcolor;
  border-bottom-width: 0;
  content: '';
  display: inline-block;
  height: 0;
  vertical-align: middle;
  width: 0;
  ${COMMON}
`

Dropdown.Menu = styled.ul`
  background-clip: padding-box;
  background-color: ${get('colors.white')};
  border: 1px solid rgba(27, 31, 35, 0.15);
  border-radius: ${get('radii.2')};
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
    border-bottom-color: ${get('colors.blackfade15')};
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

Dropdown.Item = styled.li`
  display: block;
  padding: ${get('space.1')} 10px ${get('space.1')} 15px;
  overflow: hidden;
  color: ${get('colors.gray.9')};
  text-overflow: ellipsis;
  white-space: nowrap;
  a {
    color: ${get('colors.gray.9')};
    text-decoration: none;
    display: block;
    padding: ${get('space.1')} 10px ${get('space.1')} 15px;
    overflow: hidden;
    color: ${get('colors.gray.9')};
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:focus,
  a:focus {
    color: ${get('colors.white')};
    text-decoration: none;
    background-color: ${get('colors.blue.5')};
  }

  &:hover,
  &:hover a {
    color: ${get('colors.white')};
    text-decoration: none;
    background-color: ${get('colors.blue.5')};
    outline: none;
  }
  ${COMMON};
`

Dropdown.Menu.propTypes = {
  direction: PropTypes.oneOf(['ne', 'e', 'se', 's', 'sw', 'w']),
  ...COMMON.propTypes
}

Dropdown.Menu.defaultProps = {
  direction: 'sw',
  theme
}

Dropdown.Item.defaultProps = {theme}
Dropdown.Item.propTypes = {
  ...COMMON.propTypes
}

Dropdown.Button.defaultProps = {theme}

Dropdown.Caret.defaultProps = {theme}
Dropdown.Caret.propTpyes = {
  ...COMMON.propTypes
}

Dropdown.defaultProps = {theme}
Dropdown.propTypes = {
  children: PropTypes.node,
  onToggle: PropTypes.func,
  open: PropTypes.bool,
  ...COMMON.propTypes
}

export default Dropdown
