'use strict';

var React = require('react');
var styled = require('styled-components');
var constants = require('../constants.js');
var TokenBase = require('./TokenBase.js');
var Token = require('./Token.js');
var Avatar = require('../Avatar.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const AvatarContainer = styled__default["default"].span.withConfig({
  displayName: "AvatarToken__AvatarContainer",
  componentId: "sc-62sih1-0"
})(["--spacing:calc(", " * 2);display:block;height:", ";width:", ";"], constants.get('space.1'), props => `calc(${TokenBase.tokenSizes[props.avatarSize]} - var(--spacing))`, props => `calc(${TokenBase.tokenSizes[props.avatarSize]} - var(--spacing))`);
const AvatarToken = /*#__PURE__*/React.forwardRef(({
  avatarSrc,
  id,
  size,
  ...rest
}, forwardedRef) => {
  return /*#__PURE__*/React__default["default"].createElement(Token, _extends({
    leadingVisual: () => /*#__PURE__*/React__default["default"].createElement(AvatarContainer, {
      avatarSize: size || TokenBase.defaultTokenSize
    }, /*#__PURE__*/React__default["default"].createElement(Avatar, {
      src: avatarSrc,
      size: parseInt(TokenBase.tokenSizes[size || TokenBase.defaultTokenSize], 10),
      sx: {
        width: '100%',
        height: '100%'
      }
    })),
    size: size,
    id: id === null || id === void 0 ? void 0 : id.toString(),
    sx: {
      paddingLeft: constants.get('space.1')
    }
  }, rest, {
    ref: forwardedRef
  }));
});
AvatarToken.defaultProps = {
  size: TokenBase.defaultTokenSize
};
AvatarToken.displayName = 'AvatarToken';
var AvatarToken$1 = AvatarToken;

module.exports = AvatarToken$1;
