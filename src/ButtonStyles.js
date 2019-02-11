import {get} from './constants'

const getButtonStyles = theme => {
  return `
      position: relative;
      display: inline-block;
      padding: 6px 12px;
      color: ${get('colors.gray.9')(theme)};
      background-color: ${get('colors.gray.1')(theme)};
      background-image: linear-gradient(-180deg, ${get('colors.gray.0')(theme)} 0%, ${get('colors.button.bg2')(
    theme
  )} 90%);
      font-size: ${get('fontSizes.1')(theme)}px;
      font-weight: ${get('fontWeights.bold')(theme)};
      line-height: 20px;
      white-space: nowrap;
      vertical-align: middle;
      cursor: pointer;
      user-select: none;
      background-repeat: repeat-x;
      background-position: -1px -1px;
      background-size: 110% 110%;
      border: 1px solid ${get('colors.button.border')(theme)};
      border-radius: 0.25em;
      appearance: none;

      &:hover {
        background-color: ${get('colors.button.hoverBg')(theme)};
        background-image: linear-gradient(-180deg, ${get('colors.button.bg2')(theme)} 0%, ${get(
    'colors.button.hoverBg'
  )(theme)} 90%);
        background-position: -0.5em center;
        border-color: ${get('colors.blackfade35')(theme)};
        text-decoration: none;
        background-repeat: repeat-x;
      }

      &:active {
        background-color: ${get('colors.button.activeBg')(theme)};
        background-image: none;
        box-shadow: ${get('colors.blackfade15')(theme)} 0px 0.15em 0.3em inset;
        border-color: ${get('colors.button.border')(theme)} //convert black to rbg here
      }

      &:selected {
        background-color: ${get('colors.button.activeBg')(theme)};
        background-image: none;
        box-shadow: ${get('colors.blackfade15')(theme)} 0px 0.15em 0.3em inset;
        border-color: ${get('colors.button.border')(theme)};
      }

      &:disabled {
        color: ${get('colors.button.disabledColor')(theme)};
        background-color: ${get('colors.gray.1')(theme)};
        background-image: none;
        border-color: ${get('colors.blackfade20')(theme)}
        box-shadow: none;
      }

      &:focus {
        outline: none;
        box-shadow: ${get('colors.button.focusShadow')(theme)} 0px 0px 0px 0.2em;
      }
    `
}

export default getButtonStyles
