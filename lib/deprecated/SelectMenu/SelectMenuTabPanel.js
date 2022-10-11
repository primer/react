'use strict';

var React = require('react');
var styled = require('styled-components');
var constants = require('../../constants.js');
var sx = require('../../sx.js');
var SelectMenuContext = require('./SelectMenuContext.js');
var SelectMenuList = require('./SelectMenuList.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const TabPanelBase = styled__default["default"].div.withConfig({
  displayName: "SelectMenuTabPanel__TabPanelBase",
  componentId: "sc-j4ygie-0"
})(["border-top:", " solid ", ";", ";"], constants.get('borderWidths.1'), constants.get('colors.border.muted'), sx["default"]);

const TabPanel = ({
  tabName,
  className,
  children,
  ...rest
}) => {
  const menuContext = React.useContext(SelectMenuContext.MenuContext);
  return /*#__PURE__*/React__default["default"].createElement(TabPanelBase, _extends({
    role: "tabpanel",
    className: className,
    hidden: menuContext.selectedTab !== tabName
  }, rest), /*#__PURE__*/React__default["default"].createElement(SelectMenuList, null, children));
};

TabPanel.displayName = "TabPanel";
TabPanel.displayName = 'SelectMenu.TabPanel';
var SelectMenuTabPanel = TabPanel;

module.exports = SelectMenuTabPanel;
