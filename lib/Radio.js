'use strict';

var styled = require('styled-components');
var React = require('react');
var sx = require('./sx.js');
var RadioGroup = require('./RadioGroup.js');
var _getGlobalFocusStyles = require('./_getGlobalFocusStyles.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const StyledRadio = styled__default["default"].input.withConfig({
  displayName: "Radio__StyledRadio",
  componentId: "sc-1o8nmd2-0"
})(["cursor:pointer;", " ", ";", ""], props => props.disabled && `cursor: not-allowed;`, _getGlobalFocusStyles(0), sx["default"]);
/**
 * An accessible, native radio component for selecting one option from a list.
 */

const Radio = /*#__PURE__*/React__default["default"].forwardRef(({
  checked,
  disabled,
  name: nameProp,
  onChange,
  sx: sxProp,
  required,
  validationStatus,
  value,
  ...rest
}, ref) => {
  const radioGroupContext = React.useContext(RadioGroup.RadioGroupContext);

  const handleOnChange = e => {
    (radioGroupContext === null || radioGroupContext === void 0 ? void 0 : radioGroupContext.onChange) && radioGroupContext.onChange(e);
    onChange && onChange(e);
  };

  const name = nameProp || (radioGroupContext === null || radioGroupContext === void 0 ? void 0 : radioGroupContext.name);

  if (!name) {
    // eslint-disable-next-line no-console
    console.warn('A radio input must have a `name` attribute. Pass `name` as a prop directly to each Radio, or nest them in a `RadioGroup` component with a `name` prop');
  }

  return /*#__PURE__*/React__default["default"].createElement(StyledRadio, _extends({
    type: "radio",
    value: value,
    name: name,
    ref: ref,
    disabled: disabled,
    "aria-disabled": disabled ? 'true' : 'false',
    checked: checked,
    "aria-checked": checked ? 'true' : 'false',
    required: required,
    "aria-required": required ? 'true' : 'false',
    "aria-invalid": validationStatus === 'error' ? 'true' : 'false',
    sx: sxProp,
    onChange: handleOnChange
  }, rest));
});
Radio.displayName = 'Radio';

module.exports = Radio;
