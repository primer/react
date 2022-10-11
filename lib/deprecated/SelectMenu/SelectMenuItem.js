'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var octiconsReact = require('@primer/octicons-react');
var React = require('react');
var styled = require('styled-components');
var constants = require('../../constants.js');
var StyledOcticon = require('../../StyledOcticon.js');
var sx = require('../../sx.js');
var SelectMenuContext = require('./SelectMenuContext.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const listItemStyles = styled.css(["display:flex;align-items:center;padding:", ";overflow:hidden;text-align:left;cursor:pointer;background-color:", ";border:0;border-bottom:", " solid ", ";color:", ";text-decoration:none;font-size:", ";font-family:inherit;width:100%;&:hover{text-decoration:none;}&:focus{outline:none;}&[hidden]{display:none !important;}@media (min-width:", "){padding-top:", ";padding-bottom:", ";}.SelectMenu-icon{width:", ";margin-right:", ";flex-shrink:0;}.SelectMenu-selected-icon{visibility:hidden;transition:transform 0.12s cubic-bezier(0.5,0.1,1,0.5),visibility 0s 0.12s linear;transform:scale(0);}&[aria-checked='true']{font-weight:500;color:", ";.SelectMenu-selected-icon{visibility:visible;transition:transform 0.12s cubic-bezier(0,0,0.2,1),visibility 0s linear;transform:scale(1);}}@media (hover:hover){&:hover,&:active,&:focus{background-color:", ";}}@media (hover:none){&:focus,&:active{background-color:", ";}-webkit-tap-highlight-color:", ";}"], constants.get('space.3'), constants.get('colors.canvas.overlay'), constants.get('borderWidths.1'), constants.get('colors.border.muted'), constants.get('colors.fg.muted'), constants.get('fontSizes.0'), constants.get('breakpoints.0'), constants.get('space.2'), constants.get('space.2'), constants.get('space.3'), constants.get('space.2'), constants.get('colors.fg.default'), constants.get('colors.neutral.subtle'), constants.get('colors.canvas.subtle'), constants.get('colors.selectMenu.tapHighlight'));
const StyledItem = styled__default["default"].a.attrs(() => ({
  role: 'menuitemcheckbox'
})).withConfig({
  displayName: "SelectMenuItem__StyledItem",
  componentId: "sc-9ag28r-0"
})(["", " ", ";"], listItemStyles, sx["default"]);
const SelectMenuItem = /*#__PURE__*/React.forwardRef(({
  children,
  selected,
  theme,
  onClick,
  ...rest
}, forwardedRef) => {
  const menuContext = React.useContext(SelectMenuContext.MenuContext);
  const backupRef = React.useRef(null);
  const itemRef = forwardedRef !== null && forwardedRef !== void 0 ? forwardedRef : backupRef; // close the menu when an item is clicked
  // this can be overridden if the user provides a `onClick` prop and prevents default in it

  const handleClick = e => {
    onClick && onClick(e);

    if (!e.defaultPrevented) {
      var _menuContext$setOpen;

      (_menuContext$setOpen = menuContext.setOpen) === null || _menuContext$setOpen === void 0 ? void 0 : _menuContext$setOpen.call(menuContext, false);
    }
  };

  return /*#__PURE__*/React__default["default"].createElement(StyledItem, _extends({
    ref: itemRef
  }, rest, {
    theme: theme,
    onClick: handleClick,
    "aria-checked": selected
  }), /*#__PURE__*/React__default["default"].createElement(StyledOcticon, {
    theme: theme,
    className: "SelectMenu-icon SelectMenu-selected-icon",
    icon: octiconsReact.CheckIcon
  }), children);
});
SelectMenuItem.defaultProps = {
  selected: false
};
SelectMenuItem.displayName = 'SelectMenu.Item';
var SelectMenuItem$1 = SelectMenuItem;

exports["default"] = SelectMenuItem$1;
exports.listItemStyles = listItemStyles;
