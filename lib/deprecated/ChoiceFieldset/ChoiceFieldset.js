'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var createSlots = require('../../utils/create-slots.js');
var _ValidationAnimationContainer = require('../../_ValidationAnimationContainer.js');
var _InputValidation = require('../../_InputValidation.js');
var ChoiceFieldsetListItem = require('./ChoiceFieldsetListItem.js');
var ChoiceFieldsetDescription = require('./ChoiceFieldsetDescription.js');
var ChoiceFieldsetLegend = require('./ChoiceFieldsetLegend.js');
var ChoiceFieldsetList = require('./ChoiceFieldsetList.js');
var ChoiceFieldsetValidation = require('./ChoiceFieldsetValidation.js');
var Box = require('../../Box.js');
var ssr = require('@react-aria/ssr');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

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

  const fieldsetId = ssr.useSSRSafeId(id);
  const validationChildren = (_React$Children$map = React__default["default"].Children.map(children, child => /*#__PURE__*/React__default["default"].isValidElement(child) && child.type === ChoiceFieldsetValidation ? child : null)) === null || _React$Children$map === void 0 ? void 0 : _React$Children$map.filter(Boolean);
  const validationChildToRender = validationChildren === null || validationChildren === void 0 ? void 0 : validationChildren.find(child => child.props.validationKey === validationResult);
  const validationMessageId = validationChildToRender ? `${fieldsetId}-validationMsg` : undefined;
  return /*#__PURE__*/React__default["default"].createElement(Slots, {
    context: {
      disabled,
      name,
      onSelect,
      required,
      selected,
      validationMessageId
    }
  }, slots => {
    const isLegendVisible = /*#__PURE__*/React__default["default"].isValidElement(slots.Legend) && slots.Legend.props.isVisible;
    return /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement(Box, {
      as: "fieldset",
      border: "none",
      margin: 0,
      padding: 0,
      "aria-describedby": [validationMessageId].filter(Boolean).join(' ')
    }, React__default["default"].Children.toArray(children).filter(child => /*#__PURE__*/React__default["default"].isValidElement(child) && child.type !== ChoiceFieldsetValidation), /*#__PURE__*/React__default["default"].createElement(Box, {
      mb: isLegendVisible ? 3 : undefined
    }, slots.Legend, slots.Description), slots.ChoiceList), validationChildToRender && /*#__PURE__*/React__default["default"].createElement(Box, {
      mt: 3
    }, validationMap && validationResult && validationMessageId && /*#__PURE__*/React__default["default"].createElement(_ValidationAnimationContainer, {
      show: true
    }, /*#__PURE__*/React__default["default"].createElement(_InputValidation, {
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

exports.Slot = Slot;
exports["default"] = ChoiceFieldset$1;
