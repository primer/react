import React from 'react';
import { useSSRSafeId } from '@react-aria/ssr';
import { TriangleDownIcon } from '@primer/octicons-react';
import { Divider } from './ActionList/Divider.js';
import { ActionListContainerContext } from './ActionList/ActionListContainerContext.js';
import { Button } from './Button/index.js';
import '@styled-system/css';
import merge from 'deepmerge';
import { useProvidedStateOrCreate } from './hooks/useProvidedStateOrCreate.js';
import { useProvidedRefOrCreate } from './hooks/useProvidedRefOrCreate.js';
import { useMenuKeyboardNavigation } from './hooks/useMenuKeyboardNavigation.js';
import { AnchoredOverlay } from './AnchoredOverlay/AnchoredOverlay.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const MenuContext = /*#__PURE__*/React.createContext({
  renderAnchor: null,
  open: false
});

const Menu = ({
  anchorRef: externalAnchorRef,
  open,
  onOpenChange,
  children
}) => {
  const [combinedOpenState, setCombinedOpenState] = useProvidedStateOrCreate(open, onOpenChange, false);
  const onOpen = React.useCallback(() => setCombinedOpenState(true), [setCombinedOpenState]);
  const onClose = React.useCallback(() => setCombinedOpenState(false), [setCombinedOpenState]);
  const anchorRef = useProvidedRefOrCreate(externalAnchorRef);
  const anchorId = useSSRSafeId();
  let renderAnchor = null; // 🚨 Hack for good API!
  // we strip out Anchor from children and pass it to AnchoredOverlay to render
  // with additional props for accessibility

  const contents = React.Children.map(children, child => {
    if (child.type === MenuButton || child.type === Anchor) {
      renderAnchor = anchorProps => /*#__PURE__*/React.cloneElement(child, anchorProps);

      return null;
    }

    return child;
  });
  return /*#__PURE__*/React.createElement(MenuContext.Provider, {
    value: {
      anchorRef,
      renderAnchor,
      anchorId,
      open: combinedOpenState,
      onOpen,
      onClose
    }
  }, contents);
};

Menu.displayName = "Menu";
const Anchor = /*#__PURE__*/React.forwardRef(({
  children,
  ...anchorProps
}, anchorRef) => {
  return /*#__PURE__*/React.cloneElement(children, { ...anchorProps,
    ref: anchorRef
  });
});
/** this component is syntactical sugar 🍭 */

const MenuButton = /*#__PURE__*/React.forwardRef(({
  sx: sxProp = {},
  ...props
}, anchorRef) => {
  return /*#__PURE__*/React.createElement(Anchor, {
    ref: anchorRef
  }, /*#__PURE__*/React.createElement(Button, _extends({
    type: "button",
    trailingIcon: TriangleDownIcon,
    sx: merge({
      // override the margin on caret for optical alignment
      '[data-component=trailingIcon]': {
        marginX: -1
      }
    }, sxProp)
  }, props)));
});

const Overlay = ({
  children,
  align = 'start',
  ...overlayProps
}) => {
  // we typecast anchorRef as required instead of optional
  // because we know that we're setting it in context in Menu
  const {
    anchorRef,
    renderAnchor,
    anchorId,
    open,
    onOpen,
    onClose
  } = React.useContext(MenuContext);
  const containerRef = /*#__PURE__*/React.createRef();
  useMenuKeyboardNavigation(open, onClose, containerRef, anchorRef);
  return /*#__PURE__*/React.createElement(AnchoredOverlay, {
    anchorRef: anchorRef,
    renderAnchor: renderAnchor,
    anchorId: anchorId,
    open: open,
    onOpen: onOpen,
    onClose: onClose,
    align: align,
    overlayProps: overlayProps,
    focusZoneSettings: {
      focusOutBehavior: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: containerRef
  }, /*#__PURE__*/React.createElement(ActionListContainerContext.Provider, {
    value: {
      container: 'ActionMenu',
      listRole: 'menu',
      listLabelledBy: anchorId,
      selectionAttribute: 'aria-checked',
      // Should this be here?
      afterSelect: onClose
    }
  }, children)));
};

Overlay.displayName = "Overlay";
Menu.displayName = 'ActionMenu';
const ActionMenu = Object.assign(Menu, {
  Button: MenuButton,
  Anchor,
  Overlay,
  Divider
});

export { ActionMenu };
