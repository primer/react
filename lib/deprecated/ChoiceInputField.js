'use strict';

var React = require('react');
var constants = require('../constants.js');
var slots = require('./InputField/slots.js');
var _ChoiceInputLeadingVisual = require('./_ChoiceInputLeadingVisual.js');
var InputField = require('./InputField/InputField.js');
var _InputFieldCaption = require('./InputField/_InputFieldCaption.js');
var Checkbox = require('../Checkbox.js');
var Box = require('../Box.js');
var Radio = require('../Radio.js');
var ssr = require('@react-aria/ssr');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const getInputToRender = (inputType, children) => {
  const inputComponentMap = {
    radio: Radio,
    checkbox: Checkbox
  };
  return React__default["default"].Children.toArray(children).find(child => /*#__PURE__*/React__default["default"].isValidElement(child) && child.type === inputComponentMap[inputType] ? child : null);
};

const ChoiceInputField = ({
  children,
  disabled,
  id: idProp,
  validationStatus
}) => {
  var _React$Children$map;

  const id = ssr.useSSRSafeId(idProp);
  const captionChildren = (_React$Children$map = React__default["default"].Children.map(children, child => /*#__PURE__*/React__default["default"].isValidElement(child) && child.type === _InputFieldCaption ? child : null)) === null || _React$Children$map === void 0 ? void 0 : _React$Children$map.filter(Boolean);
  const captionId = captionChildren !== null && captionChildren !== void 0 && captionChildren.length ? `${id}-caption` : undefined;
  const inputType = React__default["default"].Children.toArray(children).some(child => /*#__PURE__*/React__default["default"].isValidElement(child) ? child.type === Checkbox : false) ? 'checkbox' : 'radio';
  const ChoiceInput = getInputToRender(inputType, children);
  const choiceInputProps = /*#__PURE__*/React__default["default"].isValidElement(ChoiceInput) ? ChoiceInput.props : undefined;

  if (!ChoiceInput) {
    // eslint-disable-next-line no-console
    console.warn('To correctly render this field with the correct ARIA attributes passed to the input, please pass the Checkbox or Radio component from @primer/react as a direct child of the ChoiceInputField component');
  } else {
    if (choiceInputProps !== null && choiceInputProps !== void 0 && choiceInputProps.id) {
      // eslint-disable-next-line no-console
      console.warn(`instead of passing the 'id' prop directly to the ${inputType} input, it should be passed to the parent component, <ChoiceInputField>`);
    }

    if (choiceInputProps !== null && choiceInputProps !== void 0 && choiceInputProps.disabled) {
      // eslint-disable-next-line no-console
      console.warn(`instead of passing the 'disabled' prop directly to the ${inputType} input, it should be passed to the parent component, <ChoiceInputField>`);
    }

    if (choiceInputProps !== null && choiceInputProps !== void 0 && choiceInputProps.required) {
      // eslint-disable-next-line no-console
      console.warn(`instead of passing the 'required' prop directly to the ${inputType} input, it should be passed to the parent component, <ChoiceInputField>`);
    }
  }

  return /*#__PURE__*/React__default["default"].createElement(slots.Slots, {
    context: {
      captionId,
      disabled,
      id,
      validationStatus
    }
  }, slots => {
    return /*#__PURE__*/React__default["default"].createElement(Box, {
      display: "flex",
      alignItems: slots.LeadingVisual ? 'center' : undefined
    }, /*#__PURE__*/React__default["default"].createElement(Box, {
      sx: {
        '> input': {
          marginLeft: 0,
          marginRight: 0
        }
      }
    }, /*#__PURE__*/React__default["default"].isValidElement(ChoiceInput) && /*#__PURE__*/React__default["default"].cloneElement(ChoiceInput, {
      id,
      disabled,
      ['aria-describedby']: captionId
    }), React__default["default"].Children.toArray(children).filter(child => /*#__PURE__*/React__default["default"].isValidElement(child) && ![Checkbox, Radio].some(inputComponent => child.type === inputComponent))), slots.LeadingVisual && /*#__PURE__*/React__default["default"].createElement(Box, {
      color: disabled ? 'fg.muted' : 'fg.default',
      sx: {
        '> *': {
          minWidth: slots.Caption ? constants.get('fontSizes.4') : constants.get('fontSizes.2'),
          minHeight: slots.Caption ? constants.get('fontSizes.4') : constants.get('fontSizes.2'),
          fill: 'currentColor'
        }
      },
      ml: 2
    }, slots.LeadingVisual), /*#__PURE__*/React__default["default"].isValidElement(slots.Label) && !slots.Label.props.visuallyHidden || slots.Caption ? /*#__PURE__*/React__default["default"].createElement(Box, {
      display: "flex",
      flexDirection: "column",
      ml: 2
    }, slots.Label, slots.Caption) : /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, slots.Label, slots.Caption));
  });
};

ChoiceInputField.displayName = "ChoiceInputField";

const Label = ({
  children
}) => /*#__PURE__*/React__default["default"].createElement(InputField.Label, null, children);

Label.displayName = "Label";

/**
 * @deprecated Use `FormControl` instead. See https://primer.style/react/FormControl for more info
 */
var ChoiceInputField$1 = Object.assign(ChoiceInputField, {
  Label,
  Caption: InputField.Caption,
  LeadingVisual: _ChoiceInputLeadingVisual
});

module.exports = ChoiceInputField$1;
