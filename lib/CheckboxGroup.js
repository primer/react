'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var _CheckboxOrRadioGroupCaption = require('./_CheckboxOrRadioGroup/_CheckboxOrRadioGroupCaption.js');
var _CheckboxOrRadioGroupLabel = require('./_CheckboxOrRadioGroup/_CheckboxOrRadioGroupLabel.js');
var _CheckboxOrRadioGroupValidation = require('./_CheckboxOrRadioGroup/_CheckboxOrRadioGroupValidation.js');
var Checkbox = require('./Checkbox.js');
var CheckboxGroupContext = require('./CheckboxGroupContext.js');
var FormControl = require('./FormControl/FormControl.js');
var useRenderForcingRef = require('./hooks/useRenderForcingRef.js');
var CheckboxOrRadioGroup = require('./_CheckboxOrRadioGroup/CheckboxOrRadioGroup.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const CheckboxGroup = ({
  children,
  disabled,
  onChange,
  ...rest
}) => {
  const formControlComponentChildren = React__default["default"].Children.toArray(children).filter(child => /*#__PURE__*/React__default["default"].isValidElement(child) && child.type === FormControl).map(formControlComponent => /*#__PURE__*/React__default["default"].isValidElement(formControlComponent) ? formControlComponent.props.children : []).flat();
  const checkedCheckboxes = React__default["default"].Children.toArray(formControlComponentChildren).filter(child => /*#__PURE__*/React__default["default"].isValidElement(child) && child.type === Checkbox).map(checkbox => /*#__PURE__*/React__default["default"].isValidElement(checkbox) && (checkbox.props.checked || checkbox.props.defaultChecked) && checkbox.props.value).filter(Boolean);
  const [selectedCheckboxValues, setSelectedCheckboxValues] = useRenderForcingRef.useRenderForcingRef(checkedCheckboxes);

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

  return /*#__PURE__*/React__default["default"].createElement(CheckboxGroupContext.CheckboxGroupContext.Provider, {
    value: {
      disabled,
      onChange: e => {
        if (onChange) {
          updateSelectedCheckboxes(e);
          onChange(selectedCheckboxValues.current || [], e);
        }
      }
    }
  }, /*#__PURE__*/React__default["default"].createElement(CheckboxOrRadioGroup, _extends({
    disabled: disabled
  }, rest), children));
};

CheckboxGroup.displayName = "CheckboxGroup";
var CheckboxGroup$1 = Object.assign(CheckboxGroup, {
  Caption: _CheckboxOrRadioGroupCaption,
  Label: _CheckboxOrRadioGroupLabel,
  Validation: _CheckboxOrRadioGroupValidation
});

exports.CheckboxGroupContext = CheckboxGroupContext.CheckboxGroupContext;
exports["default"] = CheckboxGroup$1;
