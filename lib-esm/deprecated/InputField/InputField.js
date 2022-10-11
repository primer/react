import React from 'react';
import InputValidation from '../../_InputValidation.js';
import InputFieldCaption from './_InputFieldCaption.js';
import InputFieldLabel from './_InputFieldLabel.js';
import InputFieldValidation from './_InputFieldValidation.js';
import { Slots } from './slots.js';
import ValidationAnimationContainer from '../../_ValidationAnimationContainer.js';
import Box from '../../Box.js';
import TextInput from '../../TextInput.js';
import TextInputWithTokens from '../../TextInputWithTokens.js';
import Autocomplete from '../../Autocomplete/Autocomplete.js';
import Select from '../../Select.js';
import { useSSRSafeId } from '@react-aria/ssr';

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
  const id = useSSRSafeId(idProp);
  const validationChildren = (_React$Children$map = React.Children.map(children, child => /*#__PURE__*/React.isValidElement(child) && child.type === InputFieldValidation ? child : null)) === null || _React$Children$map === void 0 ? void 0 : _React$Children$map.filter(Boolean);
  const captionChildren = (_React$Children$map2 = React.Children.map(children, child => /*#__PURE__*/React.isValidElement(child) && child.type === InputFieldCaption ? child : null)) === null || _React$Children$map2 === void 0 ? void 0 : _React$Children$map2.filter(Boolean);
  const labelChild = React.Children.toArray(children).find(child => /*#__PURE__*/React.isValidElement(child) && child.type === InputFieldLabel);
  const validationChildToRender = validationChildren === null || validationChildren === void 0 ? void 0 : validationChildren.find(child => child.props.validationKey === validationResult);
  const validationMessageId = validationChildToRender ? `${id}-validationMsg` : undefined;
  const captionId = captionChildren !== null && captionChildren !== void 0 && captionChildren.length ? `${id}-caption` : undefined;
  const InputComponent = React.Children.toArray(children).find(child => expectedInputComponents.some(inputComponent => /*#__PURE__*/React.isValidElement(child) && child.type === inputComponent));
  const inputProps = /*#__PURE__*/React.isValidElement(InputComponent) ? InputComponent.props : undefined;

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

  return /*#__PURE__*/React.createElement(Slots, {
    context: {
      captionId,
      disabled,
      id,
      required,
      validationMessageId
    }
  }, slots => {
    const isLabelHidden = /*#__PURE__*/React.isValidElement(slots.Label) && slots.Label.props.visuallyHidden;
    return /*#__PURE__*/React.createElement(Box, {
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
    }, React.Children.toArray(children).filter(child => /*#__PURE__*/React.isValidElement(child) && child.type !== InputFieldValidation && !expectedInputComponents.some(inputComponent => child.type === inputComponent)), slots.Label, /*#__PURE__*/React.isValidElement(InputComponent) && /*#__PURE__*/React.cloneElement(InputComponent, {
      id,
      required,
      disabled,
      ['aria-describedby']: [validationMessageId, captionId].filter(Boolean).join(' ')
    }), validationChildToRender && validationMap && validationResult && validationMessageId && /*#__PURE__*/React.createElement(ValidationAnimationContainer, {
      show: true
    }, /*#__PURE__*/React.createElement(InputValidation, {
      validationStatus: validationMap[validationResult],
      id: validationMessageId
    }, validationChildToRender)), slots.Caption);
  });
};

InputField.displayName = "InputField";
var InputField$1 = Object.assign(InputField, {
  Caption: InputFieldCaption,
  Label: InputFieldLabel,
  Validation: InputFieldValidation
});

export { InputField$1 as default };
