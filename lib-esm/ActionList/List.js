import React from 'react';
import styled from 'styled-components';
import sx from '../sx.js';
import { ActionListContainerContext } from './ActionListContainerContext.js';
import merge from 'deepmerge';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const ListContext = /*#__PURE__*/React.createContext({});
const ListBox = styled.ul.withConfig({
  displayName: "List__ListBox",
  componentId: "sc-1x7olzq-0"
})(sx);
const List = /*#__PURE__*/React.forwardRef(({
  variant = 'inset',
  selectionVariant,
  showDividers = false,
  role,
  sx: sxProp = {},
  ...props
}, forwardedRef) => {
  const styles = {
    margin: 0,
    paddingInlineStart: 0,
    // reset ul styles
    paddingY: variant === 'inset' ? 2 : 0
  };
  /** if list is inside a Menu, it will get a role from the Menu */

  const {
    listRole,
    listLabelledBy,
    selectionVariant: containerSelectionVariant // TODO: Remove after DropdownMenu2 deprecation

  } = React.useContext(ActionListContainerContext);
  return /*#__PURE__*/React.createElement(ListBox, _extends({
    sx: merge(styles, sxProp),
    role: role || listRole,
    "aria-labelledby": listLabelledBy
  }, props, {
    ref: forwardedRef
  }), /*#__PURE__*/React.createElement(ListContext.Provider, {
    value: {
      variant,
      selectionVariant: selectionVariant || containerSelectionVariant,
      showDividers,
      role: role || listRole
    }
  }, props.children));
});
List.displayName = 'ActionList';

export { List, ListContext };
