import React from 'react';
import CheckboxOrRadioGroupCaption from './_CheckboxOrRadioGroup/_CheckboxOrRadioGroupCaption.js';
import CheckboxOrRadioGroupLabel from './_CheckboxOrRadioGroup/_CheckboxOrRadioGroupLabel.js';
import CheckboxOrRadioGroupValidation from './_CheckboxOrRadioGroup/_CheckboxOrRadioGroupValidation.js';
import Checkbox from './Checkbox.js';
import { CheckboxGroupContext } from './CheckboxGroupContext.js';
export { CheckboxGroupContext } from './CheckboxGroupContext.js';
import FormControl from './FormControl/FormControl.js';
import { useRenderForcingRef } from './hooks/useRenderForcingRef.js';
import CheckboxOrRadioGroup from './_CheckboxOrRadioGroup/CheckboxOrRadioGroup.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const CheckboxGroup = ({
  children,
  disabled,
  onChange,
  ...rest
}) => {
  const formControlComponentChildren = React.Children.toArray(children).filter(child => /*#__PURE__*/React.isValidElement(child) && child.type === FormControl).map(formControlComponent => /*#__PURE__*/React.isValidElement(formControlComponent) ? formControlComponent.props.children : []).flat();
  const checkedCheckboxes = React.Children.toArray(formControlComponentChildren).filter(child => /*#__PURE__*/React.isValidElement(child) && child.type === Checkbox).map(checkbox => /*#__PURE__*/React.isValidElement(checkbox) && (checkbox.props.checked || checkbox.props.defaultChecked) && checkbox.props.value).filter(Boolean);
  const [selectedCheckboxValues, setSelectedCheckboxValues] = useRenderForcingRef(checkedCheckboxes);

  const updateSelectedCheckboxes = e => {
    const {
      value,
      checked
    } = e.currentTarget;

    if (checked) {
      setSelectedCheckboxValues([...(selectedCheckboxValues.current || []), value]);
      return;
    }

    setSelectedCheckboxValues((selectedCheckboxValues.current || []).filter(selectedValue => selectedValue !== value));
  };

  return /*#__PURE__*/React.createElement(CheckboxGroupContext.Provider, {
    value: {
      disabled,
      onChange: e => {
        if (onChange) {
          updateSelectedCheckboxes(e);
          onChange(selectedCheckboxValues.current || [], e);
        }
      }
    }
  }, /*#__PURE__*/React.createElement(CheckboxOrRadioGroup, _extends({
    disabled: disabled
  }, rest), children));
};

CheckboxGroup.displayName = "CheckboxGroup";
var CheckboxGroup$1 = Object.assign(CheckboxGroup, {
  Caption: CheckboxOrRadioGroupCaption,
  Label: CheckboxOrRadioGroupLabel,
  Validation: CheckboxOrRadioGroupValidation
});

export { CheckboxGroup$1 as default };
