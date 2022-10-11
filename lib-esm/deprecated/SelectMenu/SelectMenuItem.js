import { CheckIcon } from '@primer/octicons-react';
import React, { forwardRef, useContext, useRef } from 'react';
import styled, { css } from 'styled-components';
import { get } from '../../constants.js';
import StyledOcticon from '../../StyledOcticon.js';
import sx from '../../sx.js';
import { MenuContext } from './SelectMenuContext.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const listItemStyles = css(["display:flex;align-items:center;padding:", ";overflow:hidden;text-align:left;cursor:pointer;background-color:", ";border:0;border-bottom:", " solid ", ";color:", ";text-decoration:none;font-size:", ";font-family:inherit;width:100%;&:hover{text-decoration:none;}&:focus{outline:none;}&[hidden]{display:none !important;}@media (min-width:", "){padding-top:", ";padding-bottom:", ";}.SelectMenu-icon{width:", ";margin-right:", ";flex-shrink:0;}.SelectMenu-selected-icon{visibility:hidden;transition:transform 0.12s cubic-bezier(0.5,0.1,1,0.5),visibility 0s 0.12s linear;transform:scale(0);}&[aria-checked='true']{font-weight:500;color:", ";.SelectMenu-selected-icon{visibility:visible;transition:transform 0.12s cubic-bezier(0,0,0.2,1),visibility 0s linear;transform:scale(1);}}@media (hover:hover){&:hover,&:active,&:focus{background-color:", ";}}@media (hover:none){&:focus,&:active{background-color:", ";}-webkit-tap-highlight-color:", ";}"], get('space.3'), get('colors.canvas.overlay'), get('borderWidths.1'), get('colors.border.muted'), get('colors.fg.muted'), get('fontSizes.0'), get('breakpoints.0'), get('space.2'), get('space.2'), get('space.3'), get('space.2'), get('colors.fg.default'), get('colors.neutral.subtle'), get('colors.canvas.subtle'), get('colors.selectMenu.tapHighlight'));
const StyledItem = styled.a.attrs(() => ({
  role: 'menuitemcheckbox'
})).withConfig({
  displayName: "SelectMenuItem__StyledItem",
  componentId: "sc-9ag28r-0"
})(["", " ", ";"], listItemStyles, sx);
const SelectMenuItem = /*#__PURE__*/forwardRef(({
  children,
  selected,
  theme,
  onClick,
  ...rest
}, forwardedRef) => {
  const menuContext = useContext(MenuContext);
  const backupRef = useRef(null);
  const itemRef = forwardedRef !== null && forwardedRef !== void 0 ? forwardedRef : backupRef; // close the menu when an item is clicked
  // this can be overridden if the user provides a `onClick` prop and prevents default in it

  const handleClick = e => {
    onClick && onClick(e);

    if (!e.defaultPrevented) {
      var _menuContext$setOpen;

      (_menuContext$setOpen = menuContext.setOpen) === null || _menuContext$setOpen === void 0 ? void 0 : _menuContext$setOpen.call(menuContext, false);
    }
  };

  return /*#__PURE__*/React.createElement(StyledItem, _extends({
    ref: itemRef
  }, rest, {
    theme: theme,
    onClick: handleClick,
    "aria-checked": selected
  }), /*#__PURE__*/React.createElement(StyledOcticon, {
    theme: theme,
    className: "SelectMenu-icon SelectMenu-selected-icon",
    icon: CheckIcon
  }), children);
});
SelectMenuItem.defaultProps = {
  selected: false
};
SelectMenuItem.displayName = 'SelectMenu.Item';
var SelectMenuItem$1 = SelectMenuItem;

export { SelectMenuItem$1 as default, listItemStyles };
