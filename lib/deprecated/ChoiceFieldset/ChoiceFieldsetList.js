'use strict';

var React = require('react');
var styled = require('styled-components');
var constants = require('../../constants.js');
var ChoiceFieldset = require('./ChoiceFieldset.js');
var ChoiceFieldsetListContext = require('./ChoiceFieldsetListContext.js');
var ssr = require('@react-aria/ssr');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const List = styled__default["default"].ul.withConfig({
  displayName: "ChoiceFieldsetList__List",
  componentId: "sc-o960a8-0"
})(["display:flex;flex-direction:column;list-style:none;margin:0;padding:0;> li + li{margin-top:", ";}"], constants.get('space.2'));

const getSelectedCheckboxes = (value, checked, selectedValues, selectionVariant) => {
  if (checked) {
    return selectionVariant === 'multiple' ? [...selectedValues, value] : [value];
  }

  return selectedValues.filter(selectedValue => selectedValue !== value);
};

const ChoiceFieldsetList = ({
  selectionVariant,
  children
}) => {
  const ssrSafeUniqueName = ssr.useSSRSafeId();
  return /*#__PURE__*/React__default["default"].createElement(ChoiceFieldset.Slot, {
    name: "ChoiceList"
  }, ({
    name,
    onSelect,
    disabled,
    selected = []
  }) => {
    return /*#__PURE__*/React__default["default"].createElement(ChoiceFieldsetListContext.Provider, {
      value: {
        disabled,
        selected,
        name: name || ssrSafeUniqueName,
        onChange: e => {
          const updatedSelections = getSelectedCheckboxes(e.currentTarget.value, e.currentTarget.checked, selected, selectionVariant);
          onSelect && onSelect(updatedSelections);
        },
        selectionVariant
      }
    }, /*#__PURE__*/React__default["default"].createElement(List, null, React__default["default"].Children.map(children, (child, i) => /*#__PURE__*/React__default["default"].createElement("li", {
      key: i
    }, child))));
  });
};

ChoiceFieldsetList.displayName = "ChoiceFieldsetList";
ChoiceFieldsetList.defaultProps = {
  selectionVariant: 'single'
};
var ChoiceFieldsetList$1 = ChoiceFieldsetList;

module.exports = ChoiceFieldsetList$1;
