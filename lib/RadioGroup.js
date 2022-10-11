'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var _CheckboxOrRadioGroupCaption = require('./_CheckboxOrRadioGroup/_CheckboxOrRadioGroupCaption.js');
var _CheckboxOrRadioGroupLabel = require('./_CheckboxOrRadioGroup/_CheckboxOrRadioGroupLabel.js');
var _CheckboxOrRadioGroupValidation = require('./_CheckboxOrRadioGroup/_CheckboxOrRadioGroupValidation.js');
var useRenderForcingRef = require('./hooks/useRenderForcingRef.js');
var CheckboxOrRadioGroup = require('./_CheckboxOrRadioGroup/CheckboxOrRadioGroup.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const RadioGroupContext = /*#__PURE__*/React.createContext(null);

const RadioGroup = ({
  children,
  disabled,
  onChange,
  name,
  ...rest
}) => {
  const [selectedRadioValue, setSelectedRadioValue] = useRenderForcingRef.useRenderForcingRef(null);

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

  return /*#__PURE__*/React__default["default"].createElement(RadioGroupContext.Provider, {
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
  }, /*#__PURE__*/React__default["default"].createElement(CheckboxOrRadioGroup, _extends({
    disabled: disabled
  }, rest), children));
};

RadioGroup.displayName = "RadioGroup";
var RadioGroup$1 = Object.assign(RadioGroup, {
  Caption: _CheckboxOrRadioGroupCaption,
  Label: _CheckboxOrRadioGroupLabel,
  Validation: _CheckboxOrRadioGroupValidation
});

exports.RadioGroupContext = RadioGroupContext;
exports["default"] = RadioGroup$1;
