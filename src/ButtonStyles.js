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
        border-color: ${get('colors.button.border')(theme)}; //convert black to rbg here
      }

      &.disabled {
        color: ${get('colors.button.disabledColor')(theme)}!important;
        background-color: ${get('colors.gray.1')(theme)}!important;
        background-image: none!important;
        border-color: ${get('colors.blackfade20')(theme)}!important;
        box-shadow: none!important;
        cursor: default;
      }

      &:focus {
        outline: none;
        box-shadow: ${get('colors.button.focusShadow')(theme)} 0px 0px 0px 0.2em;
      }

      &.grouped {
        position: relative;
        border-right-width: 0;
        border-radius: 0;

        &:first-child {
          border-top-left-radius:  ${get('radii.1')(theme)}px;
          border-bottom-left-radius: ${get('radii.1')(theme)}px;
        }

        &:last-child {
          border-right-width: 1px;
          border-top-right-radius: ${get('radii.1')(theme)}px;
          border-bottom-right-radius: ${get('radii.1')(theme)}px;
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
    `
}

export default getButtonStyles
