import {get} from './constants'
import {keyframes, css} from 'styled-components'

const animateModal = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
`
export const modalStyles = css`
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
    border-radius: 6px;
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
      box-shadow: 0 1px 5px ${get('colors.borders.blackfade15')} !default;
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
    content: " ";
    background: transparent;
  }
  // Remove marker added by the display: list-item browser default
  > summary { list-style: none; }
  // Remove marker added by details polyfill
  > summary::before { display: none; }
  // Remove marker added by Chrome
  > summary::-webkit-details-marker { display: none; }
`

export const listStyles = css`
  position: relative;
  padding: 0;
  margin: 0;
  flex: auto;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: ${get('colors.white')};
  border-top: ${get('borders.1')} ${get('colors.borders.gray')};
  -webkit-overflow-scrolling: touch; // Adds momentum + bouncy scrolling

  .SelectMenu--list-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: ${get('space.3')}px;
    overflow: hidden;
    color: ${get('colors.gray.6')};
    text-align: left;
    cursor: pointer;
    background-color: ${get('colors.white')};
    border: 0;

    & + & {
      // Add a top border only if the above element also is a list item
      border-top: ${get('borders.1')} ${get('colors.gray.2')};
    }

    &:hover {
      text-decoration: none;
    }

    &:focus {
      outline:none;
    }

    @media (min-width: ${get('breakpoints.0')}) {
      padding-top: ${get('space.2')}px;
      padding-bottom: ${get('space.2')}px;
    }
  }

  .SelectMenu--list-item[aria-checked="true"] {
    font-weight: 500;
    color: ${get('colors.gray.9')};

    .SelectMenu-icon {
      visibility: visible;
      transition: transform 0.12s cubic-bezier(0, 0, 0.2, 1), visibility 0s linear;
      transform: scale(1);
    }
  }

  @media (hover: hover) {
    body:not(.intent-mouse) .SelectMenu--list-item:focus,
    .SelectMenu--list-item:hover {
      color: ${get('colors.white')};
      background-color: ${get('colors.blue.5')};
    }

    .SelectMenu--list-item:active {
      color: ${get('colors.white')};
      background-color: ${get('colors.blue.4')};
    }

    body:not(.intent-mouse) .SelectMenuTab:focus {
      background-color: ${get('colors.blue.1')};
    }

    .SelectMenuTab:not([aria-checked="true"]):hover {
      color: ${get('colors.gray.9')};
      background-color: ${get('colors.gray.2')};
    }

    .SelectMenuTab:not([aria-checked="true"]):active {
      color: ${get('colors.gray.9')};
      background-color: ${get('colors.gray.1')};
    }
  }

  // Can not hover states
  //
  // For touch input

  @media (hover: none) {
    // Android
    .SelectMenu--list-item:focus,
    .SelectMenu--list-item:active {
      background-color: ${get('colors.gray.0')};
    }

    // iOS Safari
    // :active would work if ontouchstart is added to the button
    // Instead this tweaks the "native" highlight color
    .SelectMenu--list-item {
      -webkit-tap-highlight-color: rgba(${get('colors.gray.3')}, 0.5);
    }
  }
`