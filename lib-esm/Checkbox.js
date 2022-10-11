import styled from 'styled-components';
import React, { useContext } from 'react';
import sx from './sx.js';
import useLayoutEffect from './utils/useIsomorphicLayoutEffect.js';
import { CheckboxGroupContext } from './CheckboxGroupContext.js';
import getGlobalFocusStyles from './_getGlobalFocusStyles.js';
import { useProvidedRefOrCreate } from './hooks/useProvidedRefOrCreate.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const StyledCheckbox = styled.input.withConfig({
  displayName: "Checkbox__StyledCheckbox",
  componentId: "sc-akhawd-0"
})(["cursor:pointer;", " ", ";", ""], props => props.disabled && `cursor: not-allowed;`, getGlobalFocusStyles(0), sx);
/**
 * An accessible, native checkbox component
 */

const Checkbox = /*#__PURE__*/React.forwardRef(({
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
  const checkboxRef = useProvidedRefOrCreate(ref);
  const checkboxGroupContext = useContext(CheckboxGroupContext);

  const handleOnChange = e => {
    checkboxGroupContext.onChange && checkboxGroupContext.onChange(e);
    onChange && onChange(e);
  };

  useLayoutEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate || false;
    }
  }, [indeterminate, checked, checkboxRef]);
  return /*#__PURE__*/React.createElement(StyledCheckbox, _extends({
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

export { Checkbox$1 as default };
