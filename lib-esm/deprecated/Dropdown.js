import React from 'react';
import styled from 'styled-components';
import { get } from '../constants.js';
import Details from '../Details.js';
import getDirectionStyles from '../DropdownStyles.js';
import useDetails from '../hooks/useDetails.js';
import sx from '../sx.js';
import Button from './Button/Button.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const StyledDetails = styled(Details).withConfig({
  displayName: "Dropdown__StyledDetails",
  componentId: "sc-15ebye6-0"
})(["position:relative;display:inline-block;"]);

const Dropdown = ({
  children,
  className,
  ...rest
}) => {
  const {
    getDetailsProps
  } = useDetails({
    closeOnOutsideClick: true
  });
  return /*#__PURE__*/React.createElement(StyledDetails, _extends({
    className: className
  }, getDetailsProps(), rest), children);
};

Dropdown.displayName = "Dropdown";

const DropdownButton = ({
  children,
  ...rest
}) => {
  return /*#__PURE__*/React.createElement(Button, _extends({
    as: "summary",
    "aria-haspopup": "true"
  }, rest), children, /*#__PURE__*/React.createElement(DropdownCaret, null));
};

DropdownButton.displayName = "DropdownButton";
const DropdownCaret = styled.div.withConfig({
  displayName: "Dropdown__DropdownCaret",
  componentId: "sc-15ebye6-1"
})(["border:4px solid transparent;margin-left:12px;border-top-color:currentcolor;border-bottom-width:0;content:'';display:inline-block;height:0;vertical-align:middle;width:0;", ";"], sx);
const DropdownMenu = styled.ul.withConfig({
  displayName: "Dropdown__DropdownMenu",
  componentId: "sc-15ebye6-2"
})(["background-clip:padding-box;background-color:", ";border:1px solid ", ";border-radius:", ";box-shadow:", ";left:0;list-style:none;margin-top:2px;padding:5px 0 5px 0 !important;position:absolute;top:100%;width:160px;z-index:100;&::before{position:absolute;display:inline-block;content:'';}&::after{position:absolute;display:inline-block;content:'';}&::before{border:8px solid transparent;border-bottom-color:", ";}&::after{border:7px solid transparent;border-bottom-color:", ";}> ul{list-style:none;}", ";", ";"], get('colors.canvas.overlay'), get('colors.border.default'), get('radii.2'), get('shadows.shadow.large'), get('colors.canvas.overlay'), get('colors.canvas.overlay'), props => props.direction ? getDirectionStyles(props.theme, props.direction) : '', sx);
const DropdownItem = styled.li.withConfig({
  displayName: "Dropdown__DropdownItem",
  componentId: "sc-15ebye6-3"
})(["display:block;padding:", " 10px ", " 15px;overflow:hidden;color:", ";text-overflow:ellipsis;white-space:nowrap;a{color:", ";text-decoration:none;display:block;overflow:hidden;color:", ";text-overflow:ellipsis;white-space:nowrap;}&:focus,a:focus{color:", ";text-decoration:none;background-color:", ";}&:hover,&:hover a{color:", ";text-decoration:none;background-color:", ";outline:none;}", ";"], get('space.1'), get('space.1'), get('colors.fg.default'), get('colors.fg.default'), get('colors.fg.default'), get('colors.fg.onEmphasis'), get('colors.accent.emphasis'), get('colors.fg.onEmphasis'), get('colors.accent.emphasis'), sx);
DropdownMenu.defaultProps = {
  direction: 'sw'
};
DropdownMenu.displayName = 'Dropdown.Menu';
DropdownItem.displayName = 'Dropdown.Item';
DropdownButton.defaultProps = Button.defaultProps;
DropdownButton.displayName = 'Dropdown.Button';
DropdownCaret.displayName = 'Dropdown.Caret';
Dropdown.defaultProps = Details.defaultProps;

/**
 * @deprecated Use ActionMenu instead. See https://primer.style/react/ActionMenu for more details.
 */
var Dropdown$1 = Object.assign(Dropdown, {
  Caret: DropdownCaret,
  Menu: DropdownMenu,
  Item: DropdownItem,
  Button: DropdownButton
});

export { Dropdown$1 as default };
