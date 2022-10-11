'use strict';

var React = require('react');
var styled = require('styled-components');
var sx = require('../../sx.js');
var useKeyboardNav = require('./hooks/useKeyboardNav.js');
var SelectMenuContext = require('./SelectMenuContext.js');
var SelectMenuDivider = require('./SelectMenuDivider.js');
var SelectMenuFilter = require('./SelectMenuFilter.js');
var SelectMenuFooter = require('./SelectMenuFooter.js');
var SelectMenuHeader = require('./SelectMenuHeader.js');
var SelectMenuItem = require('./SelectMenuItem.js');
var SelectMenuList = require('./SelectMenuList.js');
var SelectMenuLoadingAnimation = require('./SelectMenuLoadingAnimation.js');
var SelectMenuModal = require('./SelectMenuModal.js');
var SelectMenuTab = require('./SelectMenuTab.js');
var SelectMenuTabPanel = require('./SelectMenuTabPanel.js');
var SelectMenuTabs = require('./SelectMenuTabs.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

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
const StyledSelectMenu = styled__default["default"].details.withConfig({
  displayName: "SelectMenu__StyledSelectMenu",
  componentId: "sc-jcdtnu-0"
})(["", " ", ";"], wrapperStyles, sx["default"]);
// 'as' is spread out because we don't want users to be able to change the tag.
const SelectMenu = /*#__PURE__*/React__default["default"].forwardRef(({
  children,
  initialTab = '',
  as: _ignoredAs,
  ...rest
}, forwardedRef) => {
  const backupRef = React.useRef(null);
  const ref = forwardedRef !== null && forwardedRef !== void 0 ? forwardedRef : backupRef;
  const [selectedTab, setSelectedTab] = React.useState(initialTab);
  const [open, setOpen] = React.useState(false);
  const menuProviderValues = {
    selectedTab,
    setSelectedTab,
    setOpen,
    open,
    initialTab
  };
  const onClickOutside = React.useCallback(event => {
    if ('current' in ref && ref.current && !ref.current.contains(event.target)) {
      if (!event.defaultPrevented) {
        setOpen(false);
      }
    }
  }, [ref, setOpen]); // handles the overlay behavior - closing the menu when clicking outside of it

  React.useEffect(() => {
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
  return /*#__PURE__*/React__default["default"].createElement(SelectMenuContext.MenuContext.Provider, {
    value: menuProviderValues
  }, /*#__PURE__*/React__default["default"].createElement(StyledSelectMenu, _extends({
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
  MenuContext: SelectMenuContext.MenuContext,
  List: SelectMenuList,
  Divider: SelectMenuDivider,
  Filter: SelectMenuFilter,
  Footer: SelectMenuFooter,
  Item: SelectMenuItem["default"],
  Modal: SelectMenuModal,
  Tabs: SelectMenuTabs,
  Tab: SelectMenuTab,
  TabPanel: SelectMenuTabPanel,
  Header: SelectMenuHeader,
  LoadingAnimation: SelectMenuLoadingAnimation
});

module.exports = SelectMenu$1;
