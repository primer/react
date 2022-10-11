'use strict';

var styled = require('styled-components');
var constants = require('./constants.js');
var sx = require('./sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function getBorderRadius({
  size,
  square
}) {
  if (square) {
    return size && size <= 24 ? '4px' : '6px';
  } else {
    return '50%';
  }
}

const Avatar = styled__default["default"].img.attrs(props => ({
  height: props.size,
  width: props.size
})).withConfig({
  displayName: "Avatar",
  componentId: "sc-oifmh0-0"
})(["display:inline-block;overflow:hidden;line-height:", ";vertical-align:middle;border-radius:", ";box-shadow:0 0 0 1px ", ";", ""], constants.get('lineHeights.condensedUltra'), props => getBorderRadius(props), constants.get('colors.avatar.border'), sx["default"]);
Avatar.defaultProps = {
  size: 20,
  alt: '',
  square: false
};

module.exports = Avatar;
