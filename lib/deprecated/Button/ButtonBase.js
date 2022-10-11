'use strict';

var styled = require('styled-components');
var styledSystem = require('styled-system');
var ButtonStyles = require('./ButtonStyles.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const variants = styledSystem.variant({
  variants: {
    small: {
      p: '4px 12px',
      fontSize: 0
    },
    medium: {
      fontSize: 1
    },
    large: {
      fontSize: 2,
      p: '10px 20px'
    }
  }
});
const ButtonBase = styled__default["default"].button.attrs(({
  disabled,
  onClick
}) => ({
  onClick: disabled ? undefined : onClick
})).withConfig({
  displayName: "ButtonBase",
  componentId: "sc-bqtwic-0"
})(["", " ", ""], ButtonStyles, variants);
ButtonBase.defaultProps = {
  variant: 'medium'
};
var ButtonBase$1 = ButtonBase;

module.exports = ButtonBase$1;
