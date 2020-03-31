import {keyframes, css} from 'styled-components'
import {get} from '../constants'

const animateModal = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
`
export const wrapperStyles = css`
  &[open] > summary::before {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 80;
    display: block;
    cursor: default;
    content: ' ';
    background: transparent;
  }
  // Remove marker added by the display: list-item browser default
  > summary {
    list-style: none;
  }
  // Remove marker added by details polyfill
  > summary::before {
    display: none;
  }
  // Remove marker added by Chrome
  > summary::-webkit-details-marker {
    display: none;
  }
`

export const modalStyles = css`
  position: relative;
  z-index: 99; // Needs to be higher than .details-overlay's z-index: 80.
  display: flex;
  ${props => (props.filter ? 'height: 80%' : '')};
  max-height: ${props => (props.filter ? 'none' : '66%')};
  margin: auto 0;
  ${props => (props.filter ? 'margin-top: 0' : '')};
  overflow: hidden; // Enables border radius on scrollable child elements
  pointer-events: auto;
  flex-direction: column;
  background-color: ${get('colors.gray.1')};
  border-radius: ${get('radii.2')};
  box-shadow: 0 1px 5px rgba(27, 31, 35, 0.15);
  animation: ${animateModal} 0.12s cubic-bezier(0, 0.1, 0.1, 1) backwards;

  @media (min-width: ${get('breakpoints.0')}) {
    width: '300px';
    height: auto;
    max-height: 350px;
    margin: ${get('space.1')} 0 ${get('space.3')} 0;
    font-size: ${get('fontSizes.0')};
    border: ${get('borders.1')} ${get('colors.border.grayDark')};
    border-radius: ${get('radii.2')};
    box-shadow: 0 1px 5px ${get('colors.blackfade15')} !default;
  }
`

export const modalWrapperStyles = css`
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
    content: '';
    background-color: ${get('colors.blackfade50')};

    @media (min-width: ${get('breakpoints.0')}) {
      display: none;
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

export const listStyles = css`
  position: relative;
  padding: 0;
  margin: 0;
  flex: auto;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: ${get('colors.white')};
  border-top: ${get('borders.1')} ${get('colors.border.gray')};
  -webkit-overflow-scrolling: touch; // Adds momentum + bouncy scrolling

  @media (hover: hover) {
    .SelectMenuTab:focus {
      background-color: ${get('colors.blue.1')};
    }

    .SelectMenuTab:not([aria-checked='true']):hover {
      color: ${get('colors.gray.9')};
      background-color: ${get('colors.gray.2')};
    }

    .SelectMenuTab:not([aria-checked='true']):active {
      color: ${get('colors.gray.9')};
      background-color: ${get('colors.gray.1')};
    }
  }
`

export const listItemStyles = css`
  display: flex;
  align-items: center;
  padding: ${get('space.3')};
  overflow: hidden;
  text-align: left;
  cursor: pointer;
  background-color: ${get('colors.white')};
  border: 0;
  border-bottom: ${get('borders.1')} ${get('colors.border.grayLight')};
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

export const tabStyles = css`
  flex: 1;
  padding: ${get('space.2')} ${get('space.3')};
  font-size: ${get('fontSizes.0')};
  font-weight: 500;
  color: ${get('colors.gray.5')};
  text-align: center;
  background-color: transparent;
  border: 0;
  box-shadow: inset 0 -1px 0 ${get('colors.border.gray')};

  @media (min-width: ${get('breakpoints.0')}) {
    flex: none;
    padding: ${get('space.1')} ${get('space.3')};
    border: ${get('borders.1')} transparent;
    border-bottom-width: 0;
    border-top-left-radius: ${get('radii.2')};
    border-top-right-radius: ${get('radii.2')};
  }

  &[aria-selected='true'] {
    z-index: 1; // Keeps box-shadow visible when hovering
    color: ${get('colors.gray.9')};
    background-color: ${get('colors.white')};
    box-shadow: 0 0 0 1px ${get('colors.border.gray')};

    @media (min-width: ${get('breakpoints.0')}) {
      border-color: ${get('colors.border.gray')};
      box-shadow: none;
    }
  }

  &:focus {
    background-color: #dbedff;
  }
`

export const tabWrapperStyles = css`
  display: flex;
  flex-shrink: 0;
  margin-bottom: -1px; // hide border of element below
  border-top: ${get('borders.1')} ${get('colors.border.gray')};
  -webkit-overflow-scrolling: touch;

  // Hide scrollbar so it doesn't cover the text
  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: ${get('breakpoints.0')}) {
    padding: 0 ${get('space.2')};
    border-top: 0;
  }
`

export const footerStyles = css`
  margin-top: -1px;
  padding: ${get('space.2')} ${get('space.3')};
  font-size: ${get('fontSizes.0')};
  color: ${get('colors.text.grayLight')};
  text-align: center;
  border-top: ${get('borders.1')} ${get('colors.border.gray')};

  @media (min-width: ${get('breakpoints.0')}) {
    padding: ${get('space.1')} ${get('space.2')};
  }
`

export const dividerStyles = css`
  padding: ${get('space.1')} ${get('space.3')};
  margin: 0;
  font-size: ${get('fontSizes.0')};
  font-weight: ${get('fontWeights.bold')};
  color: ${get('colors.text.grayLight')};
  background-color: ${get('colors.bg.gray')};
  border-bottom: ${get('borders.1')} ${get('colors.border.grayLight')};
`
