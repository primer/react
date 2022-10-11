'use strict';

var React = require('react');
var styled = require('styled-components');
var constants = require('../../constants.js');
var sx = require('../../sx.js');
var TextInput = require('../../TextInput.js');
var SelectMenuContext = require('./SelectMenuContext.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const StyledForm = styled__default["default"].form.withConfig({
  displayName: "SelectMenuFilter__StyledForm",
  componentId: "sc-1och4hk-0"
})(["padding:", ";margin:0;border-bottom:", " solid ", ";background-color:", ";@media (min-width:", "){padding:", ";}", ";"], constants.get('space.3'), constants.get('borderWidths.1'), constants.get('colors.border.muted'), constants.get('colors.canvas.overlay'), constants.get('breakpoints.0'), constants.get('space.2'), sx["default"]);
const SelectMenuFilter = /*#__PURE__*/React.forwardRef(({
  value,
  sx: sxProp,
  ...rest
}, forwardedRef) => {
  const inputRef = React.useRef(null);
  const ref = forwardedRef !== null && forwardedRef !== void 0 ? forwardedRef : inputRef;
  const {
    open
  } = React.useContext(SelectMenuContext.MenuContext); // puts focus on the filter input when the menu is opened

  React.useEffect(() => {
    if (open) {
      var _inputRef$current;

      (_inputRef$current = inputRef.current) === null || _inputRef$current === void 0 ? void 0 : _inputRef$current.focus();
    }
  }, [open]);
  return /*#__PURE__*/React__default["default"].createElement(StyledForm, {
    sx: sxProp
  }, /*#__PURE__*/React__default["default"].createElement(TextInput, _extends({
    ref: ref,
    width: "100%",
    block: true,
    value: value,
    contrast: true
  }, rest)));
});
SelectMenuFilter.displayName = 'SelectMenu.Filter';
var SelectMenuFilter$1 = SelectMenuFilter;

module.exports = SelectMenuFilter$1;
