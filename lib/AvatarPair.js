'use strict';

var React = require('react');
var styled = require('styled-components');
var Avatar = require('./Avatar.js');
var constants = require('./constants.js');
var Box = require('./Box.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const ChildAvatar = styled__default["default"](Avatar).withConfig({
  displayName: "AvatarPair__ChildAvatar",
  componentId: "sc-fw60pa-0"
})(["position:absolute;right:-15%;bottom:-9%;box-shadow:", ";"], constants.get('shadows.avatar.childShadow'));

const AvatarPair = ({
  children,
  ...rest
}) => {
  const avatars = React__default["default"].Children.map(children, (child, i) => {
    if (! /*#__PURE__*/React__default["default"].isValidElement(child)) return child;
    return i === 0 ? /*#__PURE__*/React__default["default"].cloneElement(child, {
      size: 40
    }) : /*#__PURE__*/React__default["default"].createElement(ChildAvatar, _extends({
      bg: "canvas.default"
    }, child.props, {
      size: 20
    }));
  });
  return /*#__PURE__*/React__default["default"].createElement(Box, _extends({
    position: "relative",
    display: "inline-flex"
  }, rest), avatars);
};

AvatarPair.displayName = "AvatarPair";
// styled() changes this
AvatarPair.displayName = 'AvatarPair';
var AvatarPair$1 = AvatarPair;

module.exports = AvatarPair$1;
