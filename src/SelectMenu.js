import React from 'react'
import styled, {keyframes} from 'styled-components'
import {COMMON, TYPOGRAPHY, get} from './constants'
import Button from './Button'
import theme from './theme'
import '@github/details-menu-element'

const SelectMenu = styled.details`
  &[open] > summary::before {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 80;
    display: block;
    cursor: default;
    content: " ";
    background: transparent;
  }
  // Remove marker added by the display: list-item browser default
  > summary { list-style: none; }
  // Remove marker added by details polyfill
  > summary::before { display: none; }
  // Remove marker added by Chrome
  > summary::-webkit-details-marker { display: none; }
  ${COMMON}
`

const animateModal = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
`

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  display: flex;
  padding: ${get('space.3')}px;
  pointer-events: none;
  flex-direction: column;

  &::before {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    pointer-events: none;
    content: "";
    background-color: ${get('colors.blackfade50')};

    @media (min-width: ${get('breakpoints.0')}) {
      display: none;
    }
  }

  .modal {
    position: relative;
    z-index: 99; // Needs to be higher than .details-overlay's z-index: 80.
    display: flex;
    ${props => props.filter ? 'height: 80%' : ''};
    max-height: ${props => props.filter ? 'none' : '66%'};
    margin: auto 0;
    ${props => props.filter ? 'margin-top: 0' : ''};
    overflow: hidden; // Enables border radius on scrollable child elements
    pointer-events: auto;
    flex-direction: column;
    background-color: ${get('colors.gray.1')};
    border-radius: ${get('radii.1') *2}px;
    box-shadow: 0 0 18px rgba(0, 0, 0, 0.4);
    animation: ${animateModal} 0.12s cubic-bezier(0, 0.1, 0.1, 1) backwards;

    @media (min-width: ${get('breakpoints.0')}) {
      width: ${props  => props.filter ? 'auto' : '300px'};
      height: auto;
      max-height: 350px;
      margin: ${get('space.1')}px 0 ${get('space.3')}px 0;
      font-size: ${get('fontSizes.0')}px;
      border: ${get('borders.1')} ${get('colors.borders.grayDark')};
      border-radius: ${get('radii.1')}px;
      box-shadow: $box-shadow-medium;
    }
  }

  @media (min-width: ${get('breakpoints.0')}) {
    position: absolute;
    top: auto;
    right: auto;
    bottom: auto;
    left: auto;
    padding: 0;
  }
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

const StyledInput = styled.input`
  display: block;
  width: 100%;

  @media (min-width: ${get('breakpoints.0')}) {
    font-size: ${get('fontSizes.1')}px;
  }
`


SelectMenu.Filter = (props) => {
  return (
    <StyledForm>
      <StyledInput type="text" {...props}/> 
    </StyledForm>
  )
}
export default SelectMenu