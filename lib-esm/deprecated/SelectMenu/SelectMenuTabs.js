import React from 'react';
import styled, { css } from 'styled-components';
import { get } from '../../constants.js';
import sx from '../../sx.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const tabWrapperStyles = css(["display:flex;flex-shrink:0;margin-bottom:-1px;-webkit-overflow-scrolling:touch;overflow-x:auto;overflow-y:hidden;&::-webkit-scrollbar{display:none;}@media (min-width:", "){padding:0 ", ";margin-top:", ";}"], get('breakpoints.0'), get('space.2'), get('space.3'));
const SelectMenuTabsBase = styled.div.withConfig({
  displayName: "SelectMenuTabs__SelectMenuTabsBase",
  componentId: "sc-qlz4ye-0"
})(["", " ", ";"], tabWrapperStyles, sx);

const SelectMenuTabs = ({
  children,
  ...rest
}) => {
  return /*#__PURE__*/React.createElement(SelectMenuTabsBase, _extends({
    role: "tablist"
  }, rest), children);
};

SelectMenuTabs.displayName = "SelectMenuTabs";
SelectMenuTabs.displayName = 'SelectMenu.Tabs';
var SelectMenuTabs$1 = SelectMenuTabs;

export { SelectMenuTabs$1 as default };
