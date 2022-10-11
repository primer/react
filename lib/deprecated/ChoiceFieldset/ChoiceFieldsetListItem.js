'use strict';

var React = require('react');
var ChoiceInputField = require('../ChoiceInputField.js');
var _ChoiceInputLeadingVisual = require('../_ChoiceInputLeadingVisual.js');
var ChoiceFieldCaption = require('./ChoiceFieldCaption.js');
var ChoiceFieldLabel = require('./ChoiceFieldLabel.js');
var ChoiceFieldsetListContext = require('./ChoiceFieldsetListContext.js');
var Checkbox = require('../../Checkbox.js');
var Radio = require('../../Radio.js');
var ssr = require('@react-aria/ssr');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const ChoiceFieldsetListItem = ({
  children,
  id,
  disabled: disabledProp,
  value
}) => {
  const choiceFieldsetListContext = React.useContext(ChoiceFieldsetListContext);

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
  const fieldId = ssr.useSSRSafeId(id);
  const labelChild = React__default["default"].Children.toArray(children).find(child => /*#__PURE__*/React__default["default"].isValidElement(child) && child.type === ChoiceFieldLabel);
  const otherValidChildren = React__default["default"].Children.toArray(children).filter(child => /*#__PURE__*/React__default["default"].isValidElement(child) && (child.type === ChoiceFieldCaption || child.type === _ChoiceInputLeadingVisual));
  const ChoiceInput = selectionVariant === 'multiple' ? Checkbox : Radio;
  return /*#__PURE__*/React__default["default"].createElement(ChoiceInputField, {
    id: fieldId,
    disabled: disabledProp || disabled
  }, /*#__PURE__*/React__default["default"].createElement(ChoiceInput, {
    checked: selected === null || selected === void 0 ? void 0 : selected.includes(value),
    value: value,
    name: selectionVariant === 'multiple' ? value : name,
    onChange: onChange
  }), labelChild ? // if <Item.Label> was passed, we can just render the children as-is
  children :
  /*#__PURE__*/
  // if <Item.Label> was NOT passed, treat all the children except <Item.Caption> and <Item.LeadingVisual> as the label
  React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(ChoiceInputField.Label, null, children), otherValidChildren));
};

ChoiceFieldsetListItem.displayName = "ChoiceFieldsetListItem";
var ChoiceFieldsetListItem$1 = Object.assign(ChoiceFieldsetListItem, {
  Caption: ChoiceFieldCaption,
  Label: ChoiceFieldLabel,
  LeadingVisual: _ChoiceInputLeadingVisual
});

module.exports = ChoiceFieldsetListItem$1;
