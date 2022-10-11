import React, { useContext } from 'react';
import Box from '../Box.js';
import Checkbox from '../Checkbox.js';
import Radio from '../Radio.js';
import Select from '../Select.js';
import Textarea from '../Textarea.js';
import TextInput from '../TextInput.js';
import TextInputWithTokens from '../TextInputWithTokens.js';
import FormControlCaption from './_FormControlCaption.js';
import FormControlLabel from './_FormControlLabel.js';
import FormControlValidation from './_FormControlValidation.js';
import { Slots } from './slots.js';
import ValidationAnimationContainer from '../_ValidationAnimationContainer.js';
import { get } from '../constants.js';
import FormControlLeadingVisual from './_FormControlLeadingVisual.js';
import CheckboxOrRadioGroupContext from '../_CheckboxOrRadioGroup/_CheckboxOrRadioGroupContext.js';
import InlineAutocomplete from '../drafts/InlineAutocomplete/InlineAutocomplete.js';
import Autocomplete from '../Autocomplete/Autocomplete.js';
import { useSSRSafeId } from '@react-aria/ssr';

const FormControl = /*#__PURE__*/React.forwardRef(({
  children,
  disabled: disabledProp,
  layout,
  id: idProp,
  required,
  sx
}, ref) => {
  const expectedInputComponents = [Autocomplete, Checkbox, Radio, Select, TextInput, TextInputWithTokens, Textarea, InlineAutocomplete];
  const choiceGroupContext = useContext(CheckboxOrRadioGroupContext);
  const disabled = (choiceGroupContext === null || choiceGroupContext === void 0 ? void 0 : choiceGroupContext.disabled) || disabledProp;
  const id = useSSRSafeId(idProp);
  const validationChild = React.Children.toArray(children).find(child => /*#__PURE__*/React.isValidElement(child) && child.type === FormControlValidation ? child : null);
  const captionChild = React.Children.toArray(children).find(child => /*#__PURE__*/React.isValidElement(child) && child.type === FormControlCaption ? child : null);
  const labelChild = React.Children.toArray(children).find(child => /*#__PURE__*/React.isValidElement(child) && child.type === FormControlLabel);
  const validationMessageId = validationChild && `${id}-validationMessage`;
  const captionId = captionChild && `${id}-caption`;
  const validationStatus = /*#__PURE__*/React.isValidElement(validationChild) && validationChild.props.variant;
  const InputComponent = React.Children.toArray(children).find(child => expectedInputComponents.some(inputComponent => /*#__PURE__*/React.isValidElement(child) && child.type === inputComponent));
  const inputProps = /*#__PURE__*/React.isValidElement(InputComponent) && InputComponent.props;
  const isChoiceInput = /*#__PURE__*/React.isValidElement(InputComponent) && (InputComponent.type === Checkbox || InputComponent.type === Radio);

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

    if (React.Children.toArray(children).find(child => {
      var _child$props;

      return /*#__PURE__*/React.isValidElement(child) && ((_child$props = child.props) === null || _child$props === void 0 ? void 0 : _child$props.required);
    })) {
      // eslint-disable-next-line no-console
      console.warn('An individual checkbox or radio cannot be a required field.');
    }
  } else {
    if (React.Children.toArray(children).find(child => /*#__PURE__*/React.isValidElement(child) && child.type === FormControlLeadingVisual)) {
      // eslint-disable-next-line no-console
      console.warn('A leading visual is only rendered for a checkbox or radio form control. If you want to render a leading visual inside of your input, check if your input supports a leading visual.');
    }
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
    return isChoiceInput || layout === 'horizontal' ? /*#__PURE__*/React.createElement(Box, {
      ref: ref,
      display: "flex",
      alignItems: slots.LeadingVisual ? 'center' : undefined,
      sx: sx
    }, /*#__PURE__*/React.createElement(Box, {
      sx: {
        '> input': {
          marginLeft: 0,
          marginRight: 0
        }
      }
    }, /*#__PURE__*/React.isValidElement(InputComponent) && /*#__PURE__*/React.cloneElement(InputComponent, {
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
    }, slots.Label, slots.Caption) : /*#__PURE__*/React.createElement(React.Fragment, null, slots.Label, slots.Caption)) : /*#__PURE__*/React.createElement(Box, {
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
    }, slots.Label, /*#__PURE__*/React.isValidElement(InputComponent) && /*#__PURE__*/React.cloneElement(InputComponent, {
      id,
      required,
      disabled,
      validationStatus,
      ['aria-describedby']: [validationMessageId, captionId].filter(Boolean).join(' '),
      ...InputComponent.props
    }), React.Children.toArray(children).filter(child => /*#__PURE__*/React.isValidElement(child) && !expectedInputComponents.some(inputComponent => child.type === inputComponent)), validationChild && /*#__PURE__*/React.createElement(ValidationAnimationContainer, {
      show: true
    }, slots.Validation), slots.Caption);
  });
});
FormControl.defaultProps = {
  layout: 'vertical'
};
var FormControl$1 = Object.assign(FormControl, {
  Caption: FormControlCaption,
  Label: FormControlLabel,
  LeadingVisual: FormControlLeadingVisual,
  Validation: FormControlValidation
});

export { FormControl$1 as default };
