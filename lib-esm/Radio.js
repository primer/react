import styled from 'styled-components';
import React, { useContext } from 'react';
import sx from './sx.js';
import { RadioGroupContext } from './RadioGroup.js';
import getGlobalFocusStyles from './_getGlobalFocusStyles.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const StyledRadio = styled.input.withConfig({
  displayName: "Radio__StyledRadio",
  componentId: "sc-1o8nmd2-0"
})(["cursor:pointer;", " ", ";", ""], props => props.disabled && `cursor: not-allowed;`, getGlobalFocusStyles(0), sx);
/**
 * An accessible, native radio component for selecting one option from a list.
 */

const Radio = /*#__PURE__*/React.forwardRef(({
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
  const radioGroupContext = useContext(RadioGroupContext);

  const handleOnChange = e => {
    (radioGroupContext === null || radioGroupContext === void 0 ? void 0 : radioGroupContext.onChange) && radioGroupContext.onChange(e);
    onChange && onChange(e);
  };

  const name = nameProp || (radioGroupContext === null || radioGroupContext === void 0 ? void 0 : radioGroupContext.name);

  if (!name) {
    // eslint-disable-next-line no-console
    console.warn('A radio input must have a `name` attribute. Pass `name` as a prop directly to each Radio, or nest them in a `RadioGroup` component with a `name` prop');
  }

  return /*#__PURE__*/React.createElement(StyledRadio, _extends({
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

export { Radio as default };
