import React, { forwardRef, useRef, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { get } from '../../constants.js';
import sx from '../../sx.js';
import TextInput from '../../TextInput.js';
import { MenuContext } from './SelectMenuContext.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const StyledForm = styled.form.withConfig({
  displayName: "SelectMenuFilter__StyledForm",
  componentId: "sc-1och4hk-0"
})(["padding:", ";margin:0;border-bottom:", " solid ", ";background-color:", ";@media (min-width:", "){padding:", ";}", ";"], get('space.3'), get('borderWidths.1'), get('colors.border.muted'), get('colors.canvas.overlay'), get('breakpoints.0'), get('space.2'), sx);
const SelectMenuFilter = /*#__PURE__*/forwardRef(({
  value,
  sx: sxProp,
  ...rest
}, forwardedRef) => {
  const inputRef = useRef(null);
  const ref = forwardedRef !== null && forwardedRef !== void 0 ? forwardedRef : inputRef;
  const {
    open
  } = useContext(MenuContext); // puts focus on the filter input when the menu is opened

  useEffect(() => {
    if (open) {
      var _inputRef$current;

      (_inputRef$current = inputRef.current) === null || _inputRef$current === void 0 ? void 0 : _inputRef$current.focus();
    }
  }, [open]);
  return /*#__PURE__*/React.createElement(StyledForm, {
    sx: sxProp
  }, /*#__PURE__*/React.createElement(TextInput, _extends({
    ref: ref,
    width: "100%",
    block: true,
    value: value,
    contrast: true
  }, rest)));
});
SelectMenuFilter.displayName = 'SelectMenu.Filter';
var SelectMenuFilter$1 = SelectMenuFilter;

export { SelectMenuFilter$1 as default };
