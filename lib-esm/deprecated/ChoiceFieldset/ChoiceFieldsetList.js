import React from 'react';
import styled from 'styled-components';
import { get } from '../../constants.js';
import { Slot } from './ChoiceFieldset.js';
import ChoiceFieldsetListContext from './ChoiceFieldsetListContext.js';
import { useSSRSafeId } from '@react-aria/ssr';

const List = styled.ul.withConfig({
  displayName: "ChoiceFieldsetList__List",
  componentId: "sc-o960a8-0"
})(["display:flex;flex-direction:column;list-style:none;margin:0;padding:0;> li + li{margin-top:", ";}"], get('space.2'));

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
  const ssrSafeUniqueName = useSSRSafeId();
  return /*#__PURE__*/React.createElement(Slot, {
    name: "ChoiceList"
  }, ({
    name,
    onSelect,
    disabled,
    selected = []
  }) => {
    return /*#__PURE__*/React.createElement(ChoiceFieldsetListContext.Provider, {
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
    }, /*#__PURE__*/React.createElement(List, null, React.Children.map(children, (child, i) => /*#__PURE__*/React.createElement("li", {
      key: i
    }, child))));
  });
};

ChoiceFieldsetList.displayName = "ChoiceFieldsetList";
ChoiceFieldsetList.defaultProps = {
  selectionVariant: 'single'
};
var ChoiceFieldsetList$1 = ChoiceFieldsetList;

export { ChoiceFieldsetList$1 as default };
