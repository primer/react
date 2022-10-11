import React, { useRef, useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import sx from '../../sx.js';
import useKeyboardNav from './hooks/useKeyboardNav.js';
import { MenuContext } from './SelectMenuContext.js';
import SelectMenuDivider from './SelectMenuDivider.js';
import SelectMenuFilter from './SelectMenuFilter.js';
import SelectMenuFooter from './SelectMenuFooter.js';
import SelectMenuHeader from './SelectMenuHeader.js';
import SelectMenuItem from './SelectMenuItem.js';
import SelectMenuList from './SelectMenuList.js';
import SelectMenuLoadingAnimation from './SelectMenuLoadingAnimation.js';
import SelectMenuModal from './SelectMenuModal.js';
import SelectMenuTab from './SelectMenuTab.js';
import SelectMenuTabPanel from './SelectMenuTabPanel.js';
import SelectMenuTabs from './SelectMenuTabs.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const wrapperStyles = `
  // Remove marker added by the display: list-item browser default
  > summary {
    list-style: none;
  }
  // Remove marker added by details polyfill
  > summary::before {
    display: none;
  }
  // Remove marker added by Chrome
  > summary::-webkit-details-marker {
    display: none;
  }
`;
const StyledSelectMenu = styled.details.withConfig({
  displayName: "SelectMenu__StyledSelectMenu",
  componentId: "sc-jcdtnu-0"
})(["", " ", ";"], wrapperStyles, sx);
// 'as' is spread out because we don't want users to be able to change the tag.
const SelectMenu = /*#__PURE__*/React.forwardRef(({
  children,
  initialTab = '',
  as: _ignoredAs,
  ...rest
}, forwardedRef) => {
  const backupRef = useRef(null);
  const ref = forwardedRef !== null && forwardedRef !== void 0 ? forwardedRef : backupRef;
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const [open, setOpen] = useState(false);
  const menuProviderValues = {
    selectedTab,
    setSelectedTab,
    setOpen,
    open,
    initialTab
  };
  const onClickOutside = useCallback(event => {
    if ('current' in ref && ref.current && !ref.current.contains(event.target)) {
      if (!event.defaultPrevented) {
        setOpen(false);
      }
    }
  }, [ref, setOpen]); // handles the overlay behavior - closing the menu when clicking outside of it

  useEffect(() => {
    if (open) {
      document.addEventListener('click', onClickOutside);
      return () => {
        document.removeEventListener('click', onClickOutside);
      };
    }
  }, [open, onClickOutside]);

  function toggle(event) {
    setOpen(event.target.open);
  }

  useKeyboardNav(ref, open, setOpen);
  return /*#__PURE__*/React.createElement(MenuContext.Provider, {
    value: menuProviderValues
  }, /*#__PURE__*/React.createElement(StyledSelectMenu, _extends({
    ref: ref
  }, rest, {
    open: open,
    onToggle: toggle
  }), children));
});
SelectMenu.displayName = 'SelectMenu';

/**
 * @deprecated Use ActionMenu instead. See https://primer.style/react/ActionMenu for more details.
 */
var SelectMenu$1 = Object.assign(SelectMenu, {
  MenuContext,
  List: SelectMenuList,
  Divider: SelectMenuDivider,
  Filter: SelectMenuFilter,
  Footer: SelectMenuFooter,
  Item: SelectMenuItem,
  Modal: SelectMenuModal,
  Tabs: SelectMenuTabs,
  Tab: SelectMenuTab,
  TabPanel: SelectMenuTabPanel,
  Header: SelectMenuHeader,
  LoadingAnimation: SelectMenuLoadingAnimation
});

export { SelectMenu$1 as default };
