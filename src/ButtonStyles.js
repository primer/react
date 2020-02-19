import {css} from 'styled-components'
import {get} from './constants'

export default css`
  position: relative;
  display: inline-block;
  padding: 6px 16px;
  font-weight: ${get('fontWeights.bold')};
  line-height: 20px;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  border-radius: ${get('radii.2')};
  appearance: none;
  text-decoration: none;

  &:hover {
    // needed to override link styles
    text-decoration: none;
  }

  // &:focus {
  //   outline: none;
  //   border: 3px solid ${get('buttons.default.border.focus')};
  // }

  &.grouped {
    position: relative;
    border-right-width: 0;
    border-radius: 0;

    &:first-child {
      border-top-left-radius: ${get('radii.2')};
      border-bottom-left-radius: ${get('radii.2')};
    }

    &:last-child {
      border-right-width: 1px;
      border-top-right-radius: ${get('radii.2')};
      border-bottom-right-radius: ${get('radii.2')};
    }

    &:focus,
    &:active,
    &:hover {
      border-right-width: 1px;

      + .grouped {
        border-left-width: 0;
      }
    }
  }
  &:focus,
  &:active {
    z-index: 1;
  }

  &:disabled {
    cursor: default;
  }
`
