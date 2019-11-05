import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Button from './Button'
import Details from './Details'
import {COMMON, get} from './constants'
import getDirectionStyles from './DropdownStyles'
import theme from './theme'

const DropdownBase = ({title, children, className, ...rest}) => {
  return (
    <Details overlay className={className} {...rest}>
      <>
        <Button as="summary" aria-haspopup="true" {...rest}>
          {title}
          <DropdownCaret />
        </Button>
        {children}
      </>
    </Details>
  )
}
const Dropdown = styled(DropdownBase)`
  position: relative;
  display: inline-block;
  ${COMMON};
`

const DropdownCaret = styled.div`
  border: ${get('space.1')} solid transparent;
  border-top-color: currentcolor;
  border-bottom-width: 0;
  content: '';
  display: inline-block;
  height: 0;
  vertical-align: middle;
  width: 0;
`

const DropdownMenu = styled.ul`
  background-clip: padding-box;
  background-color: ${get('colors.white')};
  border: 1px solid rgba(27, 31, 35, 0.15);
  border-radius: ${get('radii.1')};
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
    border: ${get('space.2')} solid transparent;
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

const DropdownItem = styled.li`
  display: block;
  padding: ${get('space.1')} 10px ${get('space.1')} 15px;
  overflow: hidden;
  color: ${get('colors.gray.9')};
  text-overflow: ellipsis;
  white-space: nowrap;

  &:focus {
    color: ${get('colors.white')};
    text-decoration: none;
    background-color: ${get('colors.blue.5')};
  }

  &:hover {
    color: ${get('colors.white')};
    text-decoration: none;
    background-color: ${get('colors.blue.5')};
    outline: none;
  }
  ${COMMON};
`

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

Dropdown.Item.defaultProps = {theme}
Dropdown.Item.propTypes = {
  ...COMMON.propTypes
}

Dropdown.defaultProps = {theme}
Dropdown.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  ...COMMON.propTypes
}

export default Dropdown
