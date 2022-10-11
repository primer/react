import React, { useContext } from 'react';
import styled from 'styled-components';
import { get } from '../../constants.js';
import sx from '../../sx.js';
import { MenuContext } from './SelectMenuContext.js';
import SelectMenuList from './SelectMenuList.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const TabPanelBase = styled.div.withConfig({
  displayName: "SelectMenuTabPanel__TabPanelBase",
  componentId: "sc-j4ygie-0"
})(["border-top:", " solid ", ";", ";"], get('borderWidths.1'), get('colors.border.muted'), sx);

const TabPanel = ({
  tabName,
  className,
  children,
  ...rest
}) => {
  const menuContext = useContext(MenuContext);
  return /*#__PURE__*/React.createElement(TabPanelBase, _extends({
    role: "tabpanel",
    className: className,
    hidden: menuContext.selectedTab !== tabName
  }, rest), /*#__PURE__*/React.createElement(SelectMenuList, null, children));
};

TabPanel.displayName = "TabPanel";
TabPanel.displayName = 'SelectMenu.TabPanel';
var SelectMenuTabPanel = TabPanel;

export { SelectMenuTabPanel as default };
