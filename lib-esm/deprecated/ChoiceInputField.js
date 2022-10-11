import React from 'react';
import { get } from '../constants.js';
import { Slots } from './InputField/slots.js';
import ChoiceInputLeadingVisual from './_ChoiceInputLeadingVisual.js';
import InputField from './InputField/InputField.js';
import InputFieldCaption from './InputField/_InputFieldCaption.js';
import Checkbox from '../Checkbox.js';
import Box from '../Box.js';
import Radio from '../Radio.js';
import { useSSRSafeId } from '@react-aria/ssr';

const getInputToRender = (inputType, children) => {
  const inputComponentMap = {
    radio: Radio,
    checkbox: Checkbox
  };
  return React.Children.toArray(children).find(child => /*#__PURE__*/React.isValidElement(child) && child.type === inputComponentMap[inputType] ? child : null);
};

const ChoiceInputField = ({
  children,
  disabled,
  id: idProp,
  validationStatus
}) => {
  var _React$Children$map;

  const id = useSSRSafeId(idProp);
  const captionChildren = (_React$Children$map = React.Children.map(children, child => /*#__PURE__*/React.isValidElement(child) && child.type === InputFieldCaption ? child : null)) === null || _React$Children$map === void 0 ? void 0 : _React$Children$map.filter(Boolean);
  const captionId = captionChildren !== null && captionChildren !== void 0 && captionChildren.length ? `${id}-caption` : undefined;
  const inputType = React.Children.toArray(children).some(child => /*#__PURE__*/React.isValidElement(child) ? child.type === Checkbox : false) ? 'checkbox' : 'radio';
  const ChoiceInput = getInputToRender(inputType, children);
  const choiceInputProps = /*#__PURE__*/React.isValidElement(ChoiceInput) ? ChoiceInput.props : undefined;

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

  return /*#__PURE__*/React.createElement(Slots, {
    context: {
      captionId,
      disabled,
      id,
      validationStatus
    }
  }, slots => {
    return /*#__PURE__*/React.createElement(Box, {
      display: "flex",
      alignItems: slots.LeadingVisual ? 'center' : undefined
    }, /*#__PURE__*/React.createElement(Box, {
      sx: {
        '> input': {
          marginLeft: 0,
          marginRight: 0
        }
      }
    }, /*#__PURE__*/React.isValidElement(ChoiceInput) && /*#__PURE__*/React.cloneElement(ChoiceInput, {
      id,
      disabled,
      ['aria-describedby']: captionId
    }), React.Children.toArray(children).filter(child => /*#__PURE__*/React.isValidElement(child) && ![Checkbox, Radio].some(inputComponent => child.type === inputComponent))), slots.LeadingVisual && /*#__PURE__*/React.createElement(Box, {
      color: disabled ? 'fg.muted' : 'fg.default',
      sx: {
        '> *': {
          minWidth: slots.Caption ? get('fontSizes.4') : get('fontSizes.2'),
          minHeight: slots.Caption ? get('fontSizes.4') : get('fontSizes.2'),
          fill: 'currentColor'
        }
      },
      ml: 2
    }, slots.LeadingVisual), /*#__PURE__*/React.isValidElement(slots.Label) && !slots.Label.props.visuallyHidden || slots.Caption ? /*#__PURE__*/React.createElement(Box, {
      display: "flex",
      flexDirection: "column",
      ml: 2
    }, slots.Label, slots.Caption) : /*#__PURE__*/React.createElement(React.Fragment, null, slots.Label, slots.Caption));
  });
};

ChoiceInputField.displayName = "ChoiceInputField";

const Label = ({
  children
}) => /*#__PURE__*/React.createElement(InputField.Label, null, children);

Label.displayName = "Label";

/**
 * @deprecated Use `FormControl` instead. See https://primer.style/react/FormControl for more info
 */
var ChoiceInputField$1 = Object.assign(ChoiceInputField, {
  Label,
  Caption: InputField.Caption,
  LeadingVisual: ChoiceInputLeadingVisual
});

export { ChoiceInputField$1 as default };
