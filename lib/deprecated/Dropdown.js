'use strict';

var React = require('react');
var styled = require('styled-components');
var constants = require('../constants.js');
var Details = require('../Details.js');
var DropdownStyles = require('../DropdownStyles.js');
var useDetails = require('../hooks/useDetails.js');
var sx = require('../sx.js');
var Button = require('./Button/Button.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const StyledDetails = styled__default["default"](Details).withConfig({
  displayName: "Dropdown__StyledDetails",
  componentId: "sc-15ebye6-0"
})(["position:relative;display:inline-block;"]);

const Dropdown = ({
  children,
  className,
  ...rest
}) => {
  const {
    getDetailsProps
  } = useDetails({
    closeOnOutsideClick: true
  });
  return /*#__PURE__*/React__default["default"].createElement(StyledDetails, _extends({
    className: className
  }, getDetailsProps(), rest), children);
};

Dropdown.displayName = "Dropdown";

const DropdownButton = ({
  children,
  ...rest
}) => {
  return /*#__PURE__*/React__default["default"].createElement(Button, _extends({
    as: "summary",
    "aria-haspopup": "true"
  }, rest), children, /*#__PURE__*/React__default["default"].createElement(DropdownCaret, null));
};

DropdownButton.displayName = "DropdownButton";
const DropdownCaret = styled__default["default"].div.withConfig({
  displayName: "Dropdown__DropdownCaret",
  componentId: "sc-15ebye6-1"
})(["border:4px solid transparent;margin-left:12px;border-top-color:currentcolor;border-bottom-width:0;content:'';display:inline-block;height:0;vertical-align:middle;width:0;", ";"], sx["default"]);
const DropdownMenu = styled__default["default"].ul.withConfig({
  displayName: "Dropdown__DropdownMenu",
  componentId: "sc-15ebye6-2"
})(["background-clip:padding-box;background-color:", ";border:1px solid ", ";border-radius:", ";box-shadow:", ";left:0;list-style:none;margin-top:2px;padding:5px 0 5px 0 !important;position:absolute;top:100%;width:160px;z-index:100;&::before{position:absolute;display:inline-block;content:'';}&::after{position:absolute;display:inline-block;content:'';}&::before{border:8px solid transparent;border-bottom-color:", ";}&::after{border:7px solid transparent;border-bottom-color:", ";}> ul{list-style:none;}", ";", ";"], constants.get('colors.canvas.overlay'), constants.get('colors.border.default'), constants.get('radii.2'), constants.get('shadows.shadow.large'), constants.get('colors.canvas.overlay'), constants.get('colors.canvas.overlay'), props => props.direction ? DropdownStyles(props.theme, props.direction) : '', sx["default"]);
const DropdownItem = styled__default["default"].li.withConfig({
  displayName: "Dropdown__DropdownItem",
  componentId: "sc-15ebye6-3"
})(["display:block;padding:", " 10px ", " 15px;overflow:hidden;color:", ";text-overflow:ellipsis;white-space:nowrap;a{color:", ";text-decoration:none;display:block;overflow:hidden;color:", ";text-overflow:ellipsis;white-space:nowrap;}&:focus,a:focus{color:", ";text-decoration:none;background-color:", ";}&:hover,&:hover a{color:", ";text-decoration:none;background-color:", ";outline:none;}", ";"], constants.get('space.1'), constants.get('space.1'), constants.get('colors.fg.default'), constants.get('colors.fg.default'), constants.get('colors.fg.default'), constants.get('colors.fg.onEmphasis'), constants.get('colors.accent.emphasis'), constants.get('colors.fg.onEmphasis'), constants.get('colors.accent.emphasis'), sx["default"]);
DropdownMenu.defaultProps = {
  direction: 'sw'
};
DropdownMenu.displayName = 'Dropdown.Menu';
DropdownItem.displayName = 'Dropdown.Item';
DropdownButton.defaultProps = Button.defaultProps;
DropdownButton.displayName = 'Dropdown.Button';
DropdownCaret.displayName = 'Dropdown.Caret';
Dropdown.defaultProps = Details.defaultProps;

/**
 * @deprecated Use ActionMenu instead. See https://primer.style/react/ActionMenu for more details.
 */
var Dropdown$1 = Object.assign(Dropdown, {
  Caret: DropdownCaret,
  Menu: DropdownMenu,
  Item: DropdownItem,
  Button: DropdownButton
});

module.exports = Dropdown$1;
