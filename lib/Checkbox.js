'use strict';

var styled = require('styled-components');
var React = require('react');
var sx = require('./sx.js');
var useIsomorphicLayoutEffect = require('./utils/useIsomorphicLayoutEffect.js');
var CheckboxGroupContext = require('./CheckboxGroupContext.js');
var _getGlobalFocusStyles = require('./_getGlobalFocusStyles.js');
var useProvidedRefOrCreate = require('./hooks/useProvidedRefOrCreate.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const StyledCheckbox = styled__default["default"].input.withConfig({
  displayName: "Checkbox__StyledCheckbox",
  componentId: "sc-akhawd-0"
})(["cursor:pointer;", " ", ";", ""], props => props.disabled && `cursor: not-allowed;`, _getGlobalFocusStyles(0), sx["default"]);
/**
 * An accessible, native checkbox component
 */

const Checkbox = /*#__PURE__*/React__default["default"].forwardRef(({
  checked,
  indeterminate,
  disabled,
  onChange,
  sx: sxProp,
  required,
  validationStatus,
  value,
  ...rest
}, ref) => {
  const checkboxRef = useProvidedRefOrCreate.useProvidedRefOrCreate(ref);
  const checkboxGroupContext = React.useContext(CheckboxGroupContext.CheckboxGroupContext);

  const handleOnChange = e => {
    checkboxGroupContext.onChange && checkboxGroupContext.onChange(e);
    onChange && onChange(e);
  };

  useIsomorphicLayoutEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate || false;
    }
  }, [indeterminate, checked, checkboxRef]);
  return /*#__PURE__*/React__default["default"].createElement(StyledCheckbox, _extends({
    type: "checkbox",
    disabled: disabled,
    "aria-disabled": disabled ? 'true' : 'false',
    ref: ref || checkboxRef,
    checked: indeterminate ? false : checked,
    "aria-checked": indeterminate ? 'mixed' : checked ? 'true' : 'false',
    sx: sxProp,
    required: required,
    "aria-required": required ? 'true' : 'false',
    "aria-invalid": validationStatus === 'error' ? 'true' : 'false',
    onChange: handleOnChange,
    value: value,
    name: value
  }, rest));
});
Checkbox.displayName = 'Checkbox';
var Checkbox$1 = Checkbox;

module.exports = Checkbox$1;
