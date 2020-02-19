import {css} from 'styled-components'
import {get} from './constants'

export default css`
  position: relative;
  display: inline-block;
  padding: 6px 16px;
  color: ${get('colors.gray.9')};
  background-color: ${get('colors.gray.0')};
  font-size: ${get('fontSizes.1')};
  font-weight: ${get('fontWeights.bold')};
  line-height: 20px;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  border: 1px solid ${get('colors.button.border')};
  border-radius: ${get('radii.2')};
  appearance: none;
  text-decoration: none;

  &:hover {
    background-color: ${get('colors.button.hoverBg')};
    background-image: linear-gradient(-180deg, ${get('colors.button.bg2')} 0%, ${get('colors.button.hoverBg')} 90%);
    background-position: -0.5em center;
    border-color: ${get('colors.blackfade35')};
    text-decoration: none;
    background-repeat: repeat-x;
  }

  &:active {
    background-color: ${get('colors.button.activeBg')};
    background-image: none;
    box-shadow: ${get('colors.blackfade15')} 0px 0.15em 0.3em inset;
    border-color: ${get('colors.button.border')}; //convert black to rbg here
  }

  &:focus {
    outline: none;
    box-shadow: ${get('colors.button.focusShadow')} 0px 0px 0px 0.2em;
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
    border-color: ${get('colors.blackfade20')};
    box-shadow: none;
    cursor: default;
  }
`
