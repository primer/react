import React from 'react'
import styled from 'styled-components'
import {COMMON, TYPOGRAPHY, get} from './constants'
import Button from './Button'
import TextInput from './TextInput'
import theme from './theme'
import classnames from 'classnames'
import {modalStyles, wrapperStyles, listStyles} from './SelectMenuStyles'

const SelectMenu = styled.details`
  ${wrapperStyles}
  ${COMMON}
`

const ModalWrapper = styled.div`
  ${modalStyles}
`

SelectMenu.Summary = ({children, ...rest}) => <Button as='summary' {...rest}>{children}</Button>

SelectMenu.Modal = ({children, filter, theme}) => {
  return (
    <ModalWrapper theme={theme}>
      <details-menu class='modal' role='menu'>
        {children}
      </details-menu>
    </ModalWrapper>
  )
}

SelectMenu.Modal.defaultProps = {
  theme
}

SelectMenu.Header = styled.header`
  display: flex;
  flex: none; // fixes header from getting squeezed in Safari iOS
  padding: ${get('space.3')}px;

  @media (min-width: ${get('breakpoints.0')}) {
    padding-top: ${get('space.2')}px;
    padding-bottom: ${get('space.2')}px;
  }
`

SelectMenu.Header.defaultProps = {
  theme
}

SelectMenu.Title = styled.h3`
  flex: auto;
  font-size: ${get('fontSizes.1')}px;
  font-weight: ${get('fontWeights.bold')};
  margin: 0;
  ${COMMON}
  ${TYPOGRAPHY}

  @media (min-width: ${get('breakpoints.0')}) {
    font-size: inherit;
  }
`

SelectMenu.Title.defaultProps = {
  theme
}

const StyledForm = styled.form`
  padding: ${get('space.3')}px;
  margin: 0;
  border-top: ${get('borders.1')} ${get('colors.borders.gray')}; 

  @media (min-width: ${get('breakpoints.0')}) {
    padding: ${get('space.2')}px;
  }
`

SelectMenu.Filter = (props) => {
  return (
    <StyledForm>
      <TextInput width="100%" block type="text" {...props}/> 
    </StyledForm>
  )
}

const transformChildren = children => {
  return React.Children.map(children, child => {
    return React.cloneElement(child, {role: 'menuitem', className: classnames(child.props.className, 'SelectMenu--list-item')})
  })
}

const StyledList = styled.div`
  ${listStyles}
`
SelectMenu.List = ({children, ...rest}) => {
  return (
    <StyledList {...rest}>{transformChildren(children)}</StyledList>
  )
}

SelectMenu.List.defaultProps = {
  theme
}

SelectMenu.Tabs = styled.nav`
  display: flex;
  flex-shrink: 0;
  margin-bottom: -1px; // hide border of element below
  overflow-x: auto;
  overflow-y: hidden;
  border-top: ${get('borders.1')} ${get('colors.borders.gray')};
  -webkit-overflow-scrolling: touch;

  // Hide scrollbar so it doesn't cover the text
  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: ${get('breakpoints.0')}) {
    padding: 0 ${get('space.2')}px;
    border-top: 0;
  }
`

SelectMenu.Tab = styled.button.attrs(props => ({
  className: 'SelectMenuTab',
  "aria-selected": props.selected
}))`
  flex: 1;
  padding: ${get('space.2')}px ${get('space.3')}px;
  font-size: ${get('fontSizes.0')}px;
  font-weight: 500;
  color:  ${get('colors.gray.5')};
  text-align: center;
  background-color: transparent;
  border: 0;
  box-shadow: inset 0 -1px 0 ${get('colors.borders.gray')};

  &:focus {
    outline: none;
  }

  @media (min-width: ${get('breakpoints.0')}) {
    flex: none;
    padding: ${get('space.1')}px ${get('space.3')}px;
    border: ${get('borders.1')} transparent;
    border-bottom-width: 0;
    border-top-left-radius: ${get('radii.1')}px;
    border-top-right-radius: ${get('radii.1')}px;
  }

  &[aria-selected="true"] {
    z-index: 1; // Keeps box-shadow visible when hovering
    color: ${get('colors.gray.9')};
    background-color: ${get('colors.white')};
    box-shadow: 0 0 0 1px ${get('colors.borders.gray')};

    @media (min-width: ${get('breakpoints.0')}) {
      border-color: ${get('colors.borders.gray')};
      box-shadow: none;
    }
  }
`

export default SelectMenu