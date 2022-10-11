import classnames from 'classnames';
import React, { useContext, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { get } from '../../constants.js';
import sx from '../../sx.js';
import { MenuContext } from './SelectMenuContext.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const tabStyles = css(["flex:1;padding:", " ", ";font-size:", ";font-weight:500;color:", ";text-align:center;background-color:transparent;border:0;box-shadow:inset 0 -1px 0 ", ";@media (min-width:", "){flex:none;padding:", " ", ";border:", " solid transparent;border-bottom-width:0;border-top-left-radius:", ";border-top-right-radius:", ";}&[aria-selected='true']{z-index:1;color:", ";background-color:", ";box-shadow:0 0 0 1px ", ";@media (min-width:", "){border-color:", ";box-shadow:none;}}&:focus{background-color:", ";}"], get('space.2'), get('space.3'), get('fontSizes.0'), get('colors.fg.muted'), get('colors.border.muted'), get('breakpoints.0'), get('space.1'), get('space.3'), get('borderWidths.1'), get('radii.2'), get('radii.2'), get('colors.text-primary'), get('colors.canvas.overlay'), get('colors.border.muted'), get('breakpoints.0'), get('colors.border.muted'), get('colors.neutral.subtle'));
const StyledTab = styled.button.withConfig({
  displayName: "SelectMenuTab__StyledTab",
  componentId: "sc-12lkdzo-0"
})(["", " ", ";"], tabStyles, sx);

const SelectMenuTab = ({
  tabName = '',
  index,
  className,
  onClick,
  ...rest
}) => {
  const menuContext = useContext(MenuContext);

  const handleClick = e => {
    // if consumer has attached an onClick event, call it
    onClick && onClick(e);

    if (!e.defaultPrevented) {
      var _menuContext$setSelec;

      (_menuContext$setSelec = menuContext.setSelectedTab) === null || _menuContext$setSelec === void 0 ? void 0 : _menuContext$setSelec.call(menuContext, tabName);
    }
  }; // if no tab is selected when the component renders, show the first tab


  useEffect(() => {
    if (!menuContext.selectedTab && index === 0) {
      var _menuContext$setSelec2;

      (_menuContext$setSelec2 = menuContext.setSelectedTab) === null || _menuContext$setSelec2 === void 0 ? void 0 : _menuContext$setSelec2.call(menuContext, tabName);
    }
  }, [index, menuContext, tabName]);
  const isSelected = menuContext.selectedTab === tabName;
  return /*#__PURE__*/React.createElement(StyledTab, _extends({
    role: "tab",
    className: classnames('SelectMenuTab', className),
    "aria-selected": isSelected,
    onClick: handleClick
  }, rest), tabName);
};

SelectMenuTab.displayName = "SelectMenuTab";
SelectMenuTab.displayName = 'SelectMenu.Tab';
var SelectMenuTab$1 = SelectMenuTab;

export { SelectMenuTab$1 as default };
