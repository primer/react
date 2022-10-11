'use strict';

var React = require('react');
var _InputValidation = require('../../_InputValidation.js');
var _InputFieldCaption = require('./_InputFieldCaption.js');
var _InputFieldLabel = require('./_InputFieldLabel.js');
var _InputFieldValidation = require('./_InputFieldValidation.js');
var slots = require('./slots.js');
var _ValidationAnimationContainer = require('../../_ValidationAnimationContainer.js');
var Box = require('../../Box.js');
var TextInput = require('../../TextInput.js');
var TextInputWithTokens = require('../../TextInputWithTokens.js');
var Autocomplete = require('../../Autocomplete/Autocomplete.js');
var Select = require('../../Select.js');
var ssr = require('@react-aria/ssr');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/** @deprecated Use FormControl instead. See https://primer.style/react/FormControl for more details. */
const InputField = ({
  children,
  disabled,
  id: idProp,
  required,
  validationMap,
  validationResult
}) => {
  var _React$Children$map, _React$Children$map2;

  const expectedInputComponents = [TextInput, TextInputWithTokens, Autocomplete, Select];
  const id = ssr.useSSRSafeId(idProp);
  const validationChildren = (_React$Children$map = React__default["default"].Children.map(children, child => /*#__PURE__*/React__default["default"].isValidElement(child) && child.type === _InputFieldValidation ? child : null)) === null || _React$Children$map === void 0 ? void 0 : _React$Children$map.filter(Boolean);
  const captionChildren = (_React$Children$map2 = React__default["default"].Children.map(children, child => /*#__PURE__*/React__default["default"].isValidElement(child) && child.type === _InputFieldCaption ? child : null)) === null || _React$Children$map2 === void 0 ? void 0 : _React$Children$map2.filter(Boolean);
  const labelChild = React__default["default"].Children.toArray(children).find(child => /*#__PURE__*/React__default["default"].isValidElement(child) && child.type === _InputFieldLabel);
  const validationChildToRender = validationChildren === null || validationChildren === void 0 ? void 0 : validationChildren.find(child => child.props.validationKey === validationResult);
  const validationMessageId = validationChildToRender ? `${id}-validationMsg` : undefined;
  const captionId = captionChildren !== null && captionChildren !== void 0 && captionChildren.length ? `${id}-caption` : undefined;
  const InputComponent = React__default["default"].Children.toArray(children).find(child => expectedInputComponents.some(inputComponent => /*#__PURE__*/React__default["default"].isValidElement(child) && child.type === inputComponent));
  const inputProps = /*#__PURE__*/React__default["default"].isValidElement(InputComponent) ? InputComponent.props : undefined;

  if (!InputComponent) {
    // eslint-disable-next-line no-console
    console.warn(`To correctly render this field with the correct ARIA attributes passed to the input, please pass one of the component from @primer/react as a direct child of the InputField component:
      - TextInput
      - TextInputWithTokens
      - Autocomplete`);
  } else {
    if (inputProps !== null && inputProps !== void 0 && inputProps.id) {
      // eslint-disable-next-line no-console
      console.warn(`instead of passing the 'id' prop directly to the input component, it should be passed to the parent component, <InputField>`);
    }

    if (inputProps !== null && inputProps !== void 0 && inputProps.disabled) {
      // eslint-disable-next-line no-console
      console.warn(`instead of passing the 'disabled' prop directly to the input component, it should be passed to the parent component, <InputField>`);
    }

    if (inputProps !== null && inputProps !== void 0 && inputProps.required) {
      // eslint-disable-next-line no-console
      console.warn(`instead of passing the 'required' prop directly to the input component, it should be passed to the parent component, <InputField>`);
    }
  }

  if (!labelChild) {
    // eslint-disable-next-line no-console
    console.error(`The input field with the id ${id} MUST have a InputField.Label child.\n\nIf you want to hide the label, pass the 'visuallyHidden' prop to the InputField.Label component.`);
  }

  return /*#__PURE__*/React__default["default"].createElement(slots.Slots, {
    context: {
      captionId,
      disabled,
      id,
      required,
      validationMessageId
    }
  }, slots => {
    const isLabelHidden = /*#__PURE__*/React__default["default"].isValidElement(slots.Label) && slots.Label.props.visuallyHidden;
    return /*#__PURE__*/React__default["default"].createElement(Box, {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      sx: isLabelHidden ? {
        '> *:not(label) + *': {
          marginTop: 2
        }
      } : {
        '> * + *': {
          marginTop: 2
        }
      }
    }, React__default["default"].Children.toArray(children).filter(child => /*#__PURE__*/React__default["default"].isValidElement(child) && child.type !== _InputFieldValidation && !expectedInputComponents.some(inputComponent => child.type === inputComponent)), slots.Label, /*#__PURE__*/React__default["default"].isValidElement(InputComponent) && /*#__PURE__*/React__default["default"].cloneElement(InputComponent, {
      id,
      required,
      disabled,
      ['aria-describedby']: [validationMessageId, captionId].filter(Boolean).join(' ')
    }), validationChildToRender && validationMap && validationResult && validationMessageId && /*#__PURE__*/React__default["default"].createElement(_ValidationAnimationContainer, {
      show: true
    }, /*#__PURE__*/React__default["default"].createElement(_InputValidation, {
      validationStatus: validationMap[validationResult],
      id: validationMessageId
    }, validationChildToRender)), slots.Caption);
  });
};

InputField.displayName = "InputField";
var InputField$1 = Object.assign(InputField, {
  Caption: _InputFieldCaption,
  Label: _InputFieldLabel,
  Validation: _InputFieldValidation
});

module.exports = InputField$1;
