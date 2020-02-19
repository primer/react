import {css} from 'styled-components'
import {get} from './constants'

export default css`
  position: relative;
  display: inline-block;
  padding: 6px 16px;
  color: ${get('buttons.default.color.default')};
  background-color: ${get('buttons.default.bg.default')};
  font-size: ${get('fontSizes.1')};
  font-weight: ${get('fontWeights.bold')};
  line-height: 20px;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  border: 1px solid ${get('buttons.default.border.default')};
  border-radius: ${get('radii.2')};
  appearance: none;
  text-decoration: none;
  box-shadow: ${get('buttons.default.shadow.default')};

  &:hover {
    border-color: ${get('buttons.default.border.hover')};
    box-shadow: ${get('buttons.default.shadow.hover')};
    // needed to override link styles
    text-decoration: none;
  }

  &:active {
    background-color: ${get('buttons.default.bg.active')};
    box-shadow: ${get('buttons.default.shadow.active')};
    border-color: ${get('buttons.default.border.active')};
  }

  &:focus {
    outline: none;
    border: 3px solid ${get('buttons.default.border.focus')};
  }

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
    color: ${get('buttons.default.color.disabled')};
    background-color: ${get('buttons.default.bg.disabled')};
    border-color: ${get('buttons.default.border.disabled')};
    cursor: default;
  }
`
