import React from 'react'
import styled, {keyframes} from 'styled-components'
import {COMMON, get} from './constants'
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
  padding: ${get('space.3')};
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
  }

  .modal {
    position: relative;
    z-index: 99; // Needs to be higher than .details-overlay's z-index: 80.
    display: flex;
    max-height: 66%;
    margin: auto 0;
    overflow: hidden; // Enables border radius on scrollable child elements
    pointer-events: auto;
    flex-direction: column;
    background-color: $gray-100;
    border-radius: $border-radius * 2;
    box-shadow: 0 0 18px rgba(0, 0, 0, 0.4);
    animation: ${animateModal} 0.12s cubic-bezier(0, 0.1, 0.1, 1) backwards;
  }
`

SelectMenu.Summary = ({children, ...rest}) => <Button as='summary' {...rest}>{children}</Button>

SelectMenu.Modal = ({children, theme}) => {
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
export default SelectMenu