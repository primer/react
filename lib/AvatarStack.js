'use strict';

var classnames = require('classnames');
var React = require('react');
var styled = require('styled-components');
var constants = require('./constants.js');
var Box = require('./Box.js');
var sx = require('./sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var classnames__default = /*#__PURE__*/_interopDefaultLegacy(classnames);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const AvatarStackWrapper = styled__default["default"].span.withConfig({
  displayName: "AvatarStack__AvatarStackWrapper",
  componentId: "sc-10uzy85-0"
})(["display:flex;position:relative;height:20px;min-width:", ";.pc-AvatarItem{flex-shrink:0;height:20px;width:20px;box-shadow:0 0 0 1px ", ";position:relative;overflow:hidden;transition:margin 0.2s ease-in-out,opacity 0.2s ease-in-out,visibility 0.2s ease-in-out,box-shadow 0.1s ease-in-out;&:first-child{margin-left:0;z-index:10;}&:nth-child(n + 2){margin-left:-11px;z-index:9;}&:nth-child(n + 3){margin-left:-17px;opacity:", "%;z-index:8;}&:nth-child(n + 4){opacity:", "%;z-index:7;}&:nth-child(n + 5){opacity:", "%;z-index:6;}&:nth-child(n + 6){opacity:0;visibility:hidden;}}&.pc-AvatarStack--two{min-width:30px;}&.pc-AvatarStack--three-plus{min-width:38px;}&.pc-AvatarStack--right{justify-content:flex-end;.pc-AvatarItem{margin-left:0 !important;&:first-child{margin-right:0;}&:nth-child(n + 2){margin-right:-11px;}&:nth-child(n + 3){margin-right:-17px;}}.pc-AvatarStackBody{flex-direction:row-reverse;&:hover{.pc-AvatarItem{margin-right:", "!important;margin-left:0 !important;&:first-child{margin-right:0 !important;}}}}}.pc-AvatarStackBody:hover{width:auto;.pc-AvatarItem{margin-left:", ";opacity:100%;visibility:visible;box-shadow:0 0 0 4px ", ";&:first-child{margin-left:0;}}}", ";"], props => props.count === 1 ? '20px' : props.count === 2 ? '30px' : '38px', constants.get('colors.canvas.default'), 100 - 3 * 15, 100 - 4 * 15, 100 - 5 * 15, constants.get('space.1'), constants.get('space.1'), constants.get('colors.canvas.default'), sx["default"]);

const transformChildren = children => {
  return React__default["default"].Children.map(children, child => {
    if (! /*#__PURE__*/React__default["default"].isValidElement(child)) return child;
    return /*#__PURE__*/React__default["default"].cloneElement(child, { ...child.props,
      className: classnames__default["default"](child.props.className, 'pc-AvatarItem')
    });
  });
};

const AvatarStack = ({
  children,
  alignRight,
  sx: sxProp
}) => {
  const count = React__default["default"].Children.count(children);
  const wrapperClassNames = classnames__default["default"]({
    'pc-AvatarStack--two': count === 2,
    'pc-AvatarStack--three-plus': count > 2,
    'pc-AvatarStack--right': alignRight
  });
  return /*#__PURE__*/React__default["default"].createElement(AvatarStackWrapper, {
    count: count,
    className: wrapperClassNames,
    sx: sxProp
  }, /*#__PURE__*/React__default["default"].createElement(Box, {
    position: "absolute",
    display: "flex",
    width: "38px",
    className: "pc-AvatarStackBody"
  }, transformChildren(children)));
};

AvatarStack.displayName = "AvatarStack";
var AvatarStack$1 = AvatarStack;

module.exports = AvatarStack$1;
