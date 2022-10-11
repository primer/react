'use strict';

var classnames = require('classnames');
var React = require('react');
var styled = require('styled-components');
var constants = require('../../constants.js');
var sx = require('../../sx.js');
var SelectMenuContext = require('./SelectMenuContext.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var classnames__default = /*#__PURE__*/_interopDefaultLegacy(classnames);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const tabStyles = styled.css(["flex:1;padding:", " ", ";font-size:", ";font-weight:500;color:", ";text-align:center;background-color:transparent;border:0;box-shadow:inset 0 -1px 0 ", ";@media (min-width:", "){flex:none;padding:", " ", ";border:", " solid transparent;border-bottom-width:0;border-top-left-radius:", ";border-top-right-radius:", ";}&[aria-selected='true']{z-index:1;color:", ";background-color:", ";box-shadow:0 0 0 1px ", ";@media (min-width:", "){border-color:", ";box-shadow:none;}}&:focus{background-color:", ";}"], constants.get('space.2'), constants.get('space.3'), constants.get('fontSizes.0'), constants.get('colors.fg.muted'), constants.get('colors.border.muted'), constants.get('breakpoints.0'), constants.get('space.1'), constants.get('space.3'), constants.get('borderWidths.1'), constants.get('radii.2'), constants.get('radii.2'), constants.get('colors.text-primary'), constants.get('colors.canvas.overlay'), constants.get('colors.border.muted'), constants.get('breakpoints.0'), constants.get('colors.border.muted'), constants.get('colors.neutral.subtle'));
const StyledTab = styled__default["default"].button.withConfig({
  displayName: "SelectMenuTab__StyledTab",
  componentId: "sc-12lkdzo-0"
})(["", " ", ";"], tabStyles, sx["default"]);

const SelectMenuTab = ({
  tabName = '',
  index,
  className,
  onClick,
  ...rest
}) => {
  const menuContext = React.useContext(SelectMenuContext.MenuContext);

  const handleClick = e => {
    // if consumer has attached an onClick event, call it
    onClick && onClick(e);

    if (!e.defaultPrevented) {
      var _menuContext$setSelec;

      (_menuContext$setSelec = menuContext.setSelectedTab) === null || _menuContext$setSelec === void 0 ? void 0 : _menuContext$setSelec.call(menuContext, tabName);
    }
  }; // if no tab is selected when the component renders, show the first tab


  React.useEffect(() => {
    if (!menuContext.selectedTab && index === 0) {
      var _menuContext$setSelec2;

      (_menuContext$setSelec2 = menuContext.setSelectedTab) === null || _menuContext$setSelec2 === void 0 ? void 0 : _menuContext$setSelec2.call(menuContext, tabName);
    }
  }, [index, menuContext, tabName]);
  const isSelected = menuContext.selectedTab === tabName;
  return /*#__PURE__*/React__default["default"].createElement(StyledTab, _extends({
    role: "tab",
    className: classnames__default["default"]('SelectMenuTab', className),
    "aria-selected": isSelected,
    onClick: handleClick
  }, rest), tabName);
};

SelectMenuTab.displayName = "SelectMenuTab";
SelectMenuTab.displayName = 'SelectMenu.Tab';
var SelectMenuTab$1 = SelectMenuTab;

module.exports = SelectMenuTab$1;
