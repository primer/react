import {css} from 'styled-components'
import {get} from './constants'

export default css`
  position: relative;
  display: inline-block;
  padding: 6px 16px;
  color: ${get('colors.text.grayDark')};
  background-color: ${get('colors.button.bg')};
  font-size: ${get('fontSizes.1')};
  font-weight: ${get('fontWeights.bold')};
  line-height: 20px;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  border: 1px solid ${get('colors.border.gray')};
  border-radius: ${get('radii.2')};
  appearance: none;
  text-decoration: none;

  &:hover {
    border-color: ${get('colors.button.hoverBorder')};
    box-shadow: ${get('colors.button.hoverShadow')};
    text-decoration: none;
  }

  &:active {
    background-color: ${get('colors.button.activeBg')};
    box-shadow: ${get('colors.button.activeShadow')};
    border-color: ${get('colors.button.activeBorder')};
  }

  &:focus {
    outline: none;
    border: ${get('colors.button.focusBorder')};
    box-shadow: ${get('colors.button.focusShadow')};
  }

  &.grouped {
    position: relative;
    border-right-width: 0;
    border-radius: 0;

    &:first-child {
      border-top-left-radius: ${get('radii.1')};
      border-bottom-left-radius: ${get('radii.1')};
    }

    &:last-child {
      border-right-width: 1px;
      border-top-right-radius: ${get('radii.1')};
      border-bottom-right-radius: ${get('radii.1')};
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
    color: ${get('colors.button.disabledColor')};
    background-color: ${get('colors.button.disabledBg')};
    background-image: none;
    border-color: ${get('colors.border.grayLight')};
    box-shadow: none;
    cursor: default;
  }
`
