'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var styled = require('styled-components');
var styledSystem = require('styled-system');
var constants = require('./constants.js');
var sx = require('./sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const sizeDeprecatedVariants = styledSystem.variant({
  variants: {
    small: {
      minHeight: '28px',
      px: 2,
      py: '3px',
      fontSize: 0,
      lineHeight: '20px'
    },
    large: {
      px: 2,
      py: '10px',
      fontSize: 3
    }
  }
});
const sizeVariants = styledSystem.variant({
  prop: 'size',
  variants: {
    small: {
      minHeight: '28px',
      px: 2,
      py: '3px',
      fontSize: 0,
      lineHeight: '20px'
    },
    large: {
      px: 2,
      py: '10px',
      fontSize: 3
    }
  }
});
const textInputBasePadding = '12px';
const textInputHorizPadding = textInputBasePadding;

const renderFocusStyles = (hasTrailingAction, isInputFocused) => {
  if (hasTrailingAction) {
    return isInputFocused && styled.css(["border-color:", ";outline:none;box-shadow:inset 0 0 0 1px ", ";"], constants.get('colors.accent.fg'), constants.get('colors.accent.fg'));
  }

  return styled.css(["&:focus-within{border-color:", ";outline:none;box-shadow:inset 0 0 0 1px ", ";}"], constants.get('colors.accent.fg'), constants.get('colors.accent.fg'));
};

const TextInputBaseWrapper = styled__default["default"].span.withConfig({
  displayName: "_TextInputWrapper__TextInputBaseWrapper",
  componentId: "sc-apywy2-0"
})(["font-size:", ";line-height:20px;color:", ";vertical-align:middle;background-color:", ";border:1px solid ", ";border-radius:", ";outline:none;box-shadow:", ";display:inline-flex;align-items:stretch;min-height:32px;input,textarea{cursor:text;}select{cursor:pointer;}&::placeholder{color:", ";}", " > textarea{padding:", ";}", " ", " ", " ", " ", " ", " @media (min-width:", "){font-size:", ";}", " ", " ", " ", " ", " ", ";"], constants.get('fontSizes.1'), constants.get('colors.fg.default'), constants.get('colors.canvas.default'), constants.get('colors.border.default'), constants.get('radii.2'), constants.get('shadows.primer.shadow.inset'), constants.get('colors.fg.subtle'), props => renderFocusStyles(Boolean(props.hasTrailingAction), Boolean(props.isInputFocused)), textInputBasePadding, props => props.contrast && styled.css(["background-color:", ";"], constants.get('colors.canvas.inset')), props => props.disabled && styled.css(["color:", ";background-color:", ";border-color:", ";input,textarea,select{cursor:not-allowed;}"], constants.get('colors.primer.fg.disabled'), constants.get('colors.input.disabledBg'), constants.get('colors.border.default')), props => props.monospace && styled.css(["font-family:", ";"], constants.get('fonts.mono')), props => props.validationStatus === 'error' && styled.css(["border-color:", ";", ""], constants.get('colors.danger.emphasis'), renderFocusStyles(Boolean(props.hasTrailingAction), Boolean(props.isInputFocused))), props => props.validationStatus === 'success' && styled.css(["border-color:", ";"], constants.get('colors.success.emphasis')), props => props.block && styled.css(["width:100%;display:flex;align-self:stretch;"]), constants.get('breakpoints.1'), constants.get('fontSizes.1'), styledSystem.width, styledSystem.minWidth, styledSystem.maxWidth, sizeDeprecatedVariants, sizeVariants, sx["default"]);
const TextInputWrapper = styled__default["default"](TextInputBaseWrapper).withConfig({
  displayName: "_TextInputWrapper__TextInputWrapper",
  componentId: "sc-apywy2-1"
})(["background-repeat:no-repeat;background-position:right 8px center;& >:not(:last-child){margin-right:", ";}.TextInput-icon,.TextInput-action{align-self:center;color:", ";flex-shrink:0;}", " ", " ", ";"], constants.get('space.2'), constants.get('colors.fg.muted'), props => styled.css(["padding-left:", ";padding-right:", ";> input,> select{padding-left:", ";padding-right:", ";}"], props.hasLeadingVisual ? textInputHorizPadding : 0, props.hasTrailingVisual && !props.hasTrailingAction ? textInputHorizPadding : 0, !props.hasLeadingVisual ? textInputHorizPadding : 0, !props.hasTrailingVisual && !props.hasTrailingAction ? textInputHorizPadding : 0), props => props.validationStatus === 'warning' && styled.css(["border-color:", ";", ""], constants.get('colors.attention.emphasis'), renderFocusStyles(Boolean(props.hasTrailingAction), Boolean(props.isInputFocused))), sx["default"]);
var TextInputWrapper$1 = TextInputWrapper;

exports.TextInputBaseWrapper = TextInputBaseWrapper;
exports["default"] = TextInputWrapper$1;
exports.textInputHorizPadding = textInputHorizPadding;
