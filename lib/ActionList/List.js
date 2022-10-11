'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var styled = require('styled-components');
var sx = require('../sx.js');
var ActionListContainerContext = require('./ActionListContainerContext.js');
var merge = require('deepmerge');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);
var merge__default = /*#__PURE__*/_interopDefaultLegacy(merge);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const ListContext = /*#__PURE__*/React__default["default"].createContext({});
const ListBox = styled__default["default"].ul.withConfig({
  displayName: "List__ListBox",
  componentId: "sc-1x7olzq-0"
})(sx["default"]);
const List = /*#__PURE__*/React__default["default"].forwardRef(({
  variant = 'inset',
  selectionVariant,
  showDividers = false,
  role,
  sx: sxProp = {},
  ...props
}, forwardedRef) => {
  const styles = {
    margin: 0,
    paddingInlineStart: 0,
    // reset ul styles
    paddingY: variant === 'inset' ? 2 : 0
  };
  /** if list is inside a Menu, it will get a role from the Menu */

  const {
    listRole,
    listLabelledBy,
    selectionVariant: containerSelectionVariant // TODO: Remove after DropdownMenu2 deprecation

  } = React__default["default"].useContext(ActionListContainerContext.ActionListContainerContext);
  return /*#__PURE__*/React__default["default"].createElement(ListBox, _extends({
    sx: merge__default["default"](styles, sxProp),
    role: role || listRole,
    "aria-labelledby": listLabelledBy
  }, props, {
    ref: forwardedRef
  }), /*#__PURE__*/React__default["default"].createElement(ListContext.Provider, {
    value: {
      variant,
      selectionVariant: selectionVariant || containerSelectionVariant,
      showDividers,
      role: role || listRole
    }
  }, props.children));
});
List.displayName = 'ActionList';

exports.List = List;
exports.ListContext = ListContext;
