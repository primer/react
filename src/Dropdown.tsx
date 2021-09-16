import React from 'react'
import styled from 'styled-components'
import Button, {ButtonProps} from './Button'
import {COMMON, get, SystemCommonProps} from './constants'
import Details, {DetailsProps} from './Details'
import getDirectionStyles from './DropdownStyles'
import useDetails from './hooks/useDetails'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

const StyledDetails = styled(Details)`
  position: relative;
  display: inline-block;
`

export type DropdownProps = DetailsProps

const Dropdown = ({children, className, ...rest}: DropdownProps) => {
  const {getDetailsProps} = useDetails({closeOnOutsideClick: true})
  return (
    <StyledDetails className={className} {...getDetailsProps()} {...rest}>
      {children}
    </StyledDetails>
  )
}

export type DropdownButtonProps = ButtonProps

const DropdownButton = ({children, ...rest}: DropdownButtonProps) => {
  return (
    <Button as="summary" aria-haspopup="true" {...rest}>
      {children}
      <DropdownCaret />
    </Button>
  )
}

const DropdownCaret = styled.div<SystemCommonProps & SxProp>`
  border: 4px solid transparent;
  margin-left: 12px;
  border-top-color: currentcolor;
  border-bottom-width: 0;
  content: '';
  display: inline-block;
  height: 0;
  vertical-align: middle;
  width: 0;
  ${COMMON};
  ${sx};
`

type StyledDropdownMenuProps = {
  direction?: 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'
} & SystemCommonProps &
  SxProp

const DropdownMenu = styled.ul<StyledDropdownMenuProps>`
  background-clip: padding-box;
  background-color: ${get('colors.canvas.overlay')};
  border: 1px solid ${get('colors.border.default')};
  border-radius: ${get('radii.2')};
  box-shadow: ${get('shadows.shadow.large')};
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
    border-bottom-color: ${get('colors.canvas.overlay')};
  }

  &::after {
    border: 7px solid transparent;
    border-bottom-color: ${get('colors.canvas.overlay')};
  }

  // stylelint-disable-next-line selector-max-type
  > ul {
    list-style: none;
  }
  ${props => (props.direction ? getDirectionStyles(props.theme, props.direction) : '')};
  ${COMMON};
  ${sx};
`

const DropdownItem = styled.li`
  display: block;
  padding: ${get('space.1')} 10px ${get('space.1')} 15px;
  overflow: hidden;
  color: ${get('colors.fg.default')};
  text-overflow: ellipsis;
  white-space: nowrap;
  a {
    color: ${get('colors.fg.default')};
    text-decoration: none;
    display: block;
    overflow: hidden;
    color: ${get('colors.fg.default')};
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:focus,
  a:focus {
    color: ${get('colors.fg.onEmphasis')};
    text-decoration: none;
    background-color: ${get('colors.accent.emphasis')};
  }

  &:hover,
  &:hover a {
    color: ${get('colors.fg.onEmphasis')};
    text-decoration: none;
    background-color: ${get('colors.accent.emphasis')};
    outline: none;
  }
  ${COMMON};
  ${sx};
`

DropdownMenu.defaultProps = {direction: 'sw'}
DropdownMenu.displayName = 'Dropdown.Menu'

DropdownItem.displayName = 'Dropdown.Item'

DropdownButton.defaultProps = Button.defaultProps
DropdownButton.displayName = 'Dropdown.Button'

DropdownCaret.displayName = 'Dropdown.Caret'

Dropdown.defaultProps = Details.defaultProps

export type DropdownCaretProps = ComponentProps<typeof DropdownCaret>
export type DropdownMenuProps = ComponentProps<typeof DropdownMenu>
export type DropdownItemProps = ComponentProps<typeof DropdownItem>
export default Object.assign(Dropdown, {
  Caret: DropdownCaret,
  Menu: DropdownMenu,
  Item: DropdownItem,
  Button: DropdownButton
})
