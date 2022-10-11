import React from 'react';
import createSlots from '../../utils/create-slots.js';
import ValidationAnimationContainer from '../../_ValidationAnimationContainer.js';
import InputValidation from '../../_InputValidation.js';
import ChoiceFieldsetListItem from './ChoiceFieldsetListItem.js';
import ChoiceFieldsetDescription from './ChoiceFieldsetDescription.js';
import ChoiceFieldsetLegend from './ChoiceFieldsetLegend.js';
import ChoiceFieldsetList from './ChoiceFieldsetList.js';
import ChoiceFieldsetValidation from './ChoiceFieldsetValidation.js';
import Box from '../../Box.js';
import { useSSRSafeId } from '@react-aria/ssr';

const {
  Slots,
  Slot
} = createSlots(['Description', 'ChoiceList', 'Legend', 'Validation']);

const ChoiceFieldset = ({
  children,
  disabled,
  id,
  name,
  onSelect,
  required,
  selected,
  validationMap,
  validationResult
}) => {
  var _React$Children$map;

  const fieldsetId = useSSRSafeId(id);
  const validationChildren = (_React$Children$map = React.Children.map(children, child => /*#__PURE__*/React.isValidElement(child) && child.type === ChoiceFieldsetValidation ? child : null)) === null || _React$Children$map === void 0 ? void 0 : _React$Children$map.filter(Boolean);
  const validationChildToRender = validationChildren === null || validationChildren === void 0 ? void 0 : validationChildren.find(child => child.props.validationKey === validationResult);
  const validationMessageId = validationChildToRender ? `${fieldsetId}-validationMsg` : undefined;
  return /*#__PURE__*/React.createElement(Slots, {
    context: {
      disabled,
      name,
      onSelect,
      required,
      selected,
      validationMessageId
    }
  }, slots => {
    const isLegendVisible = /*#__PURE__*/React.isValidElement(slots.Legend) && slots.Legend.props.isVisible;
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Box, {
      as: "fieldset",
      border: "none",
      margin: 0,
      padding: 0,
      "aria-describedby": [validationMessageId].filter(Boolean).join(' ')
    }, React.Children.toArray(children).filter(child => /*#__PURE__*/React.isValidElement(child) && child.type !== ChoiceFieldsetValidation), /*#__PURE__*/React.createElement(Box, {
      mb: isLegendVisible ? 3 : undefined
    }, slots.Legend, slots.Description), slots.ChoiceList), validationChildToRender && /*#__PURE__*/React.createElement(Box, {
      mt: 3
    }, validationMap && validationResult && validationMessageId && /*#__PURE__*/React.createElement(ValidationAnimationContainer, {
      show: true
    }, /*#__PURE__*/React.createElement(InputValidation, {
      validationStatus: validationMap[validationResult],
      id: validationMessageId
    }, validationChildToRender))));
  });
};

ChoiceFieldset.displayName = "ChoiceFieldset";

/**
 * @deprecated Use `CheckboxGroup` or `RadioGroup` instead. See https://primer.style/react/CheckboxGroup and https://primer.style/react/RadioGroup for more info
 */
var ChoiceFieldset$1 = Object.assign(ChoiceFieldset, {
  Description: ChoiceFieldsetDescription,
  Item: ChoiceFieldsetListItem,
  Legend: ChoiceFieldsetLegend,
  List: ChoiceFieldsetList,
  Validation: ChoiceFieldsetValidation
});

export { Slot, ChoiceFieldset$1 as default };
