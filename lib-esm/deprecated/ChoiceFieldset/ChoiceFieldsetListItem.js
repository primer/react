import React, { useContext } from 'react';
import ChoiceInputField from '../ChoiceInputField.js';
import ChoiceInputLeadingVisual from '../_ChoiceInputLeadingVisual.js';
import ChoiceFieldCaption from './ChoiceFieldCaption.js';
import ChoiceFieldLabel from './ChoiceFieldLabel.js';
import ChoiceFieldsetListContext from './ChoiceFieldsetListContext.js';
import Checkbox from '../../Checkbox.js';
import Radio from '../../Radio.js';
import { useSSRSafeId } from '@react-aria/ssr';

const ChoiceFieldsetListItem = ({
  children,
  id,
  disabled: disabledProp,
  value
}) => {
  const choiceFieldsetListContext = useContext(ChoiceFieldsetListContext);

  if (choiceFieldsetListContext === null) {
    throw new Error('ChoiceFieldsetListContext returned null');
  }

  const {
    name,
    onChange,
    selected,
    disabled,
    selectionVariant
  } = choiceFieldsetListContext;
  const fieldId = useSSRSafeId(id);
  const labelChild = React.Children.toArray(children).find(child => /*#__PURE__*/React.isValidElement(child) && child.type === ChoiceFieldLabel);
  const otherValidChildren = React.Children.toArray(children).filter(child => /*#__PURE__*/React.isValidElement(child) && (child.type === ChoiceFieldCaption || child.type === ChoiceInputLeadingVisual));
  const ChoiceInput = selectionVariant === 'multiple' ? Checkbox : Radio;
  return /*#__PURE__*/React.createElement(ChoiceInputField, {
    id: fieldId,
    disabled: disabledProp || disabled
  }, /*#__PURE__*/React.createElement(ChoiceInput, {
    checked: selected === null || selected === void 0 ? void 0 : selected.includes(value),
    value: value,
    name: selectionVariant === 'multiple' ? value : name,
    onChange: onChange
  }), labelChild ? // if <Item.Label> was passed, we can just render the children as-is
  children :
  /*#__PURE__*/
  // if <Item.Label> was NOT passed, treat all the children except <Item.Caption> and <Item.LeadingVisual> as the label
  React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ChoiceInputField.Label, null, children), otherValidChildren));
};

ChoiceFieldsetListItem.displayName = "ChoiceFieldsetListItem";
var ChoiceFieldsetListItem$1 = Object.assign(ChoiceFieldsetListItem, {
  Caption: ChoiceFieldCaption,
  Label: ChoiceFieldLabel,
  LeadingVisual: ChoiceInputLeadingVisual
});

export { ChoiceFieldsetListItem$1 as default };
