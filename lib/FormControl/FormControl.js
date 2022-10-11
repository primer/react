'use strict';

var React = require('react');
var Box = require('../Box.js');
var Checkbox = require('../Checkbox.js');
var Radio = require('../Radio.js');
var Select = require('../Select.js');
var Textarea = require('../Textarea.js');
var TextInput = require('../TextInput.js');
var TextInputWithTokens = require('../TextInputWithTokens.js');
var _FormControlCaption = require('./_FormControlCaption.js');
var _FormControlLabel = require('./_FormControlLabel.js');
var _FormControlValidation = require('./_FormControlValidation.js');
var slots = require('./slots.js');
var _ValidationAnimationContainer = require('../_ValidationAnimationContainer.js');
var constants = require('../constants.js');
var _FormControlLeadingVisual = require('./_FormControlLeadingVisual.js');
var _CheckboxOrRadioGroupContext = require('../_CheckboxOrRadioGroup/_CheckboxOrRadioGroupContext.js');
var InlineAutocomplete = require('../drafts/InlineAutocomplete/InlineAutocomplete.js');
var Autocomplete = require('../Autocomplete/Autocomplete.js');
var ssr = require('@react-aria/ssr');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const FormControl = /*#__PURE__*/React__default["default"].forwardRef(({
  children,
  disabled: disabledProp,
  layout,
  id: idProp,
  required,
  sx
}, ref) => {
  const expectedInputComponents = [Autocomplete, Checkbox, Radio, Select, TextInput, TextInputWithTokens, Textarea["default"], InlineAutocomplete];
  const choiceGroupContext = React.useContext(_CheckboxOrRadioGroupContext);
  const disabled = (choiceGroupContext === null || choiceGroupContext === void 0 ? void 0 : choiceGroupContext.disabled) || disabledProp;
  const id = ssr.useSSRSafeId(idProp);
  const validationChild = React__default["default"].Children.toArray(children).find(child => /*#__PURE__*/React__default["default"].isValidElement(child) && child.type === _FormControlValidation ? child : null);
  const captionChild = React__default["default"].Children.toArray(children).find(child => /*#__PURE__*/React__default["default"].isValidElement(child) && child.type === _FormControlCaption ? child : null);
  const labelChild = React__default["default"].Children.toArray(children).find(child => /*#__PURE__*/React__default["default"].isValidElement(child) && child.type === _FormControlLabel);
  const validationMessageId = validationChild && `${id}-validationMessage`;
  const captionId = captionChild && `${id}-caption`;
  const validationStatus = /*#__PURE__*/React__default["default"].isValidElement(validationChild) && validationChild.props.variant;
  const InputComponent = React__default["default"].Children.toArray(children).find(child => expectedInputComponents.some(inputComponent => /*#__PURE__*/React__default["default"].isValidElement(child) && child.type === inputComponent));
  const inputProps = /*#__PURE__*/React__default["default"].isValidElement(InputComponent) && InputComponent.props;
  const isChoiceInput = /*#__PURE__*/React__default["default"].isValidElement(InputComponent) && (InputComponent.type === Checkbox || InputComponent.type === Radio);

  if (InputComponent) {
    if (inputProps !== null && inputProps !== void 0 && inputProps.id) {
      // eslint-disable-next-line no-console
      console.warn(`instead of passing the 'id' prop directly to the input component, it should be passed to the parent component, <FormControl>`);
    }

    if (inputProps !== null && inputProps !== void 0 && inputProps.disabled) {
      // eslint-disable-next-line no-console
      console.warn(`instead of passing the 'disabled' prop directly to the input component, it should be passed to the parent component, <FormControl>`);
    }

    if (inputProps !== null && inputProps !== void 0 && inputProps.required) {
      // eslint-disable-next-line no-console
      console.warn(`instead of passing the 'required' prop directly to the input component, it should be passed to the parent component, <FormControl>`);
    }
  }

  if (!labelChild) {
    // eslint-disable-next-line no-console
    console.error(`The input field with the id ${id} MUST have a FormControl.Label child.\n\nIf you want to hide the label, pass the 'visuallyHidden' prop to the FormControl.Label component.`);
  }

  if (isChoiceInput) {
    if (validationChild) {
      // eslint-disable-next-line no-console
      console.warn('Validation messages are not rendered for an individual checkbox or radio. The validation message should be shown for all options.');
    }

    if (React__default["default"].Children.toArray(children).find(child => {
      var _child$props;

      return /*#__PURE__*/React__default["default"].isValidElement(child) && ((_child$props = child.props) === null || _child$props === void 0 ? void 0 : _child$props.required);
    })) {
      // eslint-disable-next-line no-console
      console.warn('An individual checkbox or radio cannot be a required field.');
    }
  } else {
    if (React__default["default"].Children.toArray(children).find(child => /*#__PURE__*/React__default["default"].isValidElement(child) && child.type === _FormControlLeadingVisual)) {
      // eslint-disable-next-line no-console
      console.warn('A leading visual is only rendered for a checkbox or radio form control. If you want to render a leading visual inside of your input, check if your input supports a leading visual.');
    }
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
    return isChoiceInput || layout === 'horizontal' ? /*#__PURE__*/React__default["default"].createElement(Box, {
      ref: ref,
      display: "flex",
      alignItems: slots.LeadingVisual ? 'center' : undefined,
      sx: sx
    }, /*#__PURE__*/React__default["default"].createElement(Box, {
      sx: {
        '> input': {
          marginLeft: 0,
          marginRight: 0
        }
      }
    }, /*#__PURE__*/React__default["default"].isValidElement(InputComponent) && /*#__PURE__*/React__default["default"].cloneElement(InputComponent, {
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
    }, slots.Label, slots.Caption) : /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, slots.Label, slots.Caption)) : /*#__PURE__*/React__default["default"].createElement(Box, {
      ref: ref,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      sx: { ...(isLabelHidden ? {
          '> *:not(label) + *': {
            marginTop: 1
          }
        } : {
          '> * + *': {
            marginTop: 1
          }
        }),
        ...sx
      }
    }, slots.Label, /*#__PURE__*/React__default["default"].isValidElement(InputComponent) && /*#__PURE__*/React__default["default"].cloneElement(InputComponent, {
      id,
      required,
      disabled,
      validationStatus,
      ['aria-describedby']: [validationMessageId, captionId].filter(Boolean).join(' '),
      ...InputComponent.props
    }), React__default["default"].Children.toArray(children).filter(child => /*#__PURE__*/React__default["default"].isValidElement(child) && !expectedInputComponents.some(inputComponent => child.type === inputComponent)), validationChild && /*#__PURE__*/React__default["default"].createElement(_ValidationAnimationContainer, {
      show: true
    }, slots.Validation), slots.Caption);
  });
});
FormControl.defaultProps = {
  layout: 'vertical'
};
var FormControl$1 = Object.assign(FormControl, {
  Caption: _FormControlCaption,
  Label: _FormControlLabel,
  LeadingVisual: _FormControlLeadingVisual,
  Validation: _FormControlValidation
});

module.exports = FormControl$1;
