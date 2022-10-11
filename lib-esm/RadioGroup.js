import React, { createContext } from 'react';
import CheckboxOrRadioGroupCaption from './_CheckboxOrRadioGroup/_CheckboxOrRadioGroupCaption.js';
import CheckboxOrRadioGroupLabel from './_CheckboxOrRadioGroup/_CheckboxOrRadioGroupLabel.js';
import CheckboxOrRadioGroupValidation from './_CheckboxOrRadioGroup/_CheckboxOrRadioGroupValidation.js';
import { useRenderForcingRef } from './hooks/useRenderForcingRef.js';
import CheckboxOrRadioGroup from './_CheckboxOrRadioGroup/CheckboxOrRadioGroup.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const RadioGroupContext = /*#__PURE__*/createContext(null);

const RadioGroup = ({
  children,
  disabled,
  onChange,
  name,
  ...rest
}) => {
  const [selectedRadioValue, setSelectedRadioValue] = useRenderForcingRef(null);

  const updateSelectedCheckboxes = e => {
    const {
      value,
      checked
    } = e.currentTarget;

    if (checked) {
      setSelectedRadioValue(value);
      return;
    }
  };

  return /*#__PURE__*/React.createElement(RadioGroupContext.Provider, {
    value: {
      disabled,
      name,
      onChange: e => {
        if (onChange) {
          updateSelectedCheckboxes(e);
          onChange(selectedRadioValue.current, e);
        }
      }
    }
  }, /*#__PURE__*/React.createElement(CheckboxOrRadioGroup, _extends({
    disabled: disabled
  }, rest), children));
};

RadioGroup.displayName = "RadioGroup";
var RadioGroup$1 = Object.assign(RadioGroup, {
  Caption: CheckboxOrRadioGroupCaption,
  Label: CheckboxOrRadioGroupLabel,
  Validation: CheckboxOrRadioGroupValidation
});

export { RadioGroupContext, RadioGroup$1 as default };
