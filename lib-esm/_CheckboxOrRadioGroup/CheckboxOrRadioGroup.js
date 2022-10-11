import React from 'react';
import Box from '../Box.js';
import ValidationAnimationContainer from '../_ValidationAnimationContainer.js';
import CheckboxOrRadioGroupCaption from './_CheckboxOrRadioGroupCaption.js';
import CheckboxOrRadioGroupLabel from './_CheckboxOrRadioGroupLabel.js';
import CheckboxOrRadioGroupValidation from './_CheckboxOrRadioGroupValidation.js';
import { Slots } from './slots.js';
import styled from 'styled-components';
import { get } from '../constants.js';
import CheckboxOrRadioGroupContext from './_CheckboxOrRadioGroupContext.js';
import VisuallyHidden from '../_VisuallyHidden.js';
import { useSSRSafeId } from '@react-aria/ssr';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const Body = styled.div.withConfig({
  displayName: "CheckboxOrRadioGroup__Body",
  componentId: "sc-1qo75yk-0"
})(["display:flex;flex-direction:column;list-style:none;margin:0;padding:0;> * + *{margin-top:", ";}"], get('space.2'));

const CheckboxOrRadioGroup = ({
  'aria-labelledby': ariaLabelledby,
  children,
  disabled,
  id: idProp,
  required,
  sx
}) => {
  const labelChild = React.Children.toArray(children).find(child => /*#__PURE__*/React.isValidElement(child) && child.type === CheckboxOrRadioGroupLabel);
  const validationChild = React.Children.toArray(children).find(child => /*#__PURE__*/React.isValidElement(child) && child.type === CheckboxOrRadioGroupValidation ? child : null);
  const captionChild = React.Children.toArray(children).find(child => /*#__PURE__*/React.isValidElement(child) && child.type === CheckboxOrRadioGroupCaption ? child : null);
  const id = useSSRSafeId(idProp);
  const validationMessageId = validationChild && `${id}-validationMessage`;
  const captionId = captionChild && `${id}-caption`;

  if (!labelChild && !ariaLabelledby) {
    // eslint-disable-next-line no-console
    console.warn('A choice group must be labelled using a `CheckboxOrRadioGroup.Label` child, or by passing `aria-labelledby` to the CheckboxOrRadioGroup component.');
  }

  return /*#__PURE__*/React.createElement(Slots, {
    context: {
      disabled,
      required,
      captionId,
      validationMessageId
    }
  }, slots => {
    const isLegendVisible = /*#__PURE__*/React.isValidElement(labelChild) && !labelChild.props.visuallyHidden;
    return /*#__PURE__*/React.createElement(CheckboxOrRadioGroupContext.Provider, {
      value: {
        disabled
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Box, _extends({
      border: "none",
      margin: 0,
      mb: validationChild ? 2 : undefined,
      padding: 0
    }, labelChild && {
      as: 'fieldset',
      disabled
    }, {
      sx: sx
    }), labelChild ?
    /*#__PURE__*/

    /*
      Placing the caption text and validation text in the <legend> provides a better user
      experience for more screenreaders.
       Reference: https://blog.tenon.io/accessible-validation-of-checkbox-and-radiobutton-groups/
    */
    React.createElement(Box, {
      as: "legend",
      mb: isLegendVisible ? 2 : undefined,
      padding: 0
    }, slots.Label, slots.Caption, /*#__PURE__*/React.isValidElement(slots.Validation) && slots.Validation.props.children && /*#__PURE__*/React.createElement(VisuallyHidden, null, slots.Validation.props.children)) :
    /*
      If CheckboxOrRadioGroup.Label wasn't passed as a child, we don't render a <legend> 
      but we still want to render a caption
    */
    slots.Caption, /*#__PURE__*/React.createElement(Body, !labelChild && {
      ['aria-labelledby']: ariaLabelledby,
      ['aria-describedby']: [validationMessageId, captionId].filter(Boolean).join(' '),
      as: 'div',
      role: 'group'
    }, React.Children.toArray(children).filter(child => /*#__PURE__*/React.isValidElement(child)))), validationChild && /*#__PURE__*/React.createElement(ValidationAnimationContainer // If we have CheckboxOrRadioGroup.Label as a child, we render a screenreader-accessible validation message in the <legend>
    , {
      "aria-hidden": Boolean(labelChild),
      show: true
    }, slots.Validation)));
  });
};

CheckboxOrRadioGroup.displayName = "CheckboxOrRadioGroup";
CheckboxOrRadioGroup.defaultProps = {
  disabled: false,
  required: false
};
var CheckboxOrRadioGroup$1 = Object.assign(CheckboxOrRadioGroup, {
  Caption: CheckboxOrRadioGroupCaption,
  Label: CheckboxOrRadioGroupLabel,
  Validation: CheckboxOrRadioGroupValidation
});

export { CheckboxOrRadioGroup$1 as default };
