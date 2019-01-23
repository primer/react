import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import styled from 'styled-components'
import StyledOcticon from './StyledOcticon'
import {TriangleDown} from '@githubprimer/octicons-react'
import Button from './Button'
import BorderBox from './BorderBox'
import Caret from './Caret'
import Details from './Details'
import Flex from './Flex'
import {COMMON, get} from './constants'
import directionStyles from './DropdownStyles'
import theme from './theme'

const Dropdown = styled(Details)`
  position: relative;
  display: inline-block;
  ${COMMON}
`

const DropdownCaret = styled.div`
  border: 4px solid transparent;
  border-top-color: currentcolor;
  content: "";
  display: inline-block;
  height: 0;
  vertical-align: middle;
  width: 0;
`

const DropdownButton = ({children, ...rest}) => {
  return (
    <Button is='summary' aria-haspopup="true" {...rest}>
      {children}
      <DropdownCaret/>
    </Button>
  )
}

const DropdownMenu = styled.ul`
  background-clip: padding-box;
  background-color: #fff;
  border: 1px solid rgba(27,31,35,.15);
  border-radius: 4px;
  box-shadow: 0 3px 12px rgba(27,31,35,.15);
  left: 0;
  list-style: none;
  margin-top: 2px;
  padding-bottom: 5px;
  padding-top: 5px;
  position: absolute;
  top: 100%;
  width: 160px;
  z-index: 100;

  &::before {
    position: absolute;
    display: inline-block;
    content: "";
  }

  &::after {
    position: absolute;
    display: inline-block;
    content: "";
  }

  &::before {
    border: 8px solid transparent;
    border-bottom-color: ${get('colors.blackFade15')};
  }

  &::after {
    border: 7px solid transparent;
    border-bottom-color: ${get('colors.white')}
  }

  // stylelint-disable-next-line selector-max-type
  > ul {
    list-style: none;
  }
  ${props => directionStyles[props.direction]}
`
Dropdown.defaultProps = {
  theme
}

Dropdown.Button = DropdownButton
Dropdown.Menu = DropdownMenu

Dropdown.Menu.propTypes = {
  direction: PropTypes.oneOf(['n', 'e', 's', 'w', 'nw', 'ne', 'sw', 'se'])
}

Dropdown.propTypes = {
  children: PropTypes.node,
  scheme: Button.propTypes.scheme,
  title: PropTypes.string,
  ...COMMON.propTypes
}

export default Dropdown
