import { List } from './ActionList/List.js';
import { Item } from './ActionList/Item.js';
import { Divider } from './ActionList/Divider.js';
import React, { useCallback, useMemo } from 'react';
import { useProvidedStateOrCreate } from '../hooks/useProvidedStateOrCreate.js';
import { useProvidedRefOrCreate } from '../hooks/useProvidedRefOrCreate.js';
import { AnchoredOverlay } from '../AnchoredOverlay/AnchoredOverlay.js';
import Button from './Button/Button.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const ActionMenuItem = props => /*#__PURE__*/React.createElement(Item, _extends({
  role: "menuitem"
}, props));

ActionMenuItem.displayName = "ActionMenuItem";
ActionMenuItem.displayName = 'ActionMenu.Item';

const ActionMenuBase = ({
  anchorContent,
  renderAnchor = props => /*#__PURE__*/React.createElement(Button, props),
  anchorRef: externalAnchorRef,
  onAction,
  open,
  setOpen,
  overlayProps,
  items,
  ...listProps
}) => {
  const [combinedOpenState, setCombinedOpenState] = useProvidedStateOrCreate(open, setOpen, false);
  const anchorRef = useProvidedRefOrCreate(externalAnchorRef);
  const onOpen = useCallback(() => setCombinedOpenState(true), [setCombinedOpenState]);
  const onClose = useCallback(() => setCombinedOpenState(false), [setCombinedOpenState]);
  const renderMenuAnchor = useMemo(() => {
    if (renderAnchor === null) {
      return null;
    }

    return props => {
      return renderAnchor({
        'aria-label': 'menu',
        children: anchorContent,
        ...props
      });
    };
  }, [anchorContent, renderAnchor]);
  const itemsToRender = useMemo(() => {
    return items.map(item => {
      return { ...item,
        role: 'menuitem',
        onAction: (props, event) => {
          var _item$onAction;

          const actionCallback = (_item$onAction = item.onAction) !== null && _item$onAction !== void 0 ? _item$onAction : onAction;
          actionCallback === null || actionCallback === void 0 ? void 0 : actionCallback(props, event);

          if (!event.defaultPrevented) {
            onClose();
          }
        }
      };
    });
  }, [items, onAction, onClose]);
  return /*#__PURE__*/React.createElement(AnchoredOverlay, {
    renderAnchor: renderMenuAnchor,
    anchorRef: anchorRef,
    open: combinedOpenState,
    onOpen: onOpen,
    onClose: onClose,
    overlayProps: overlayProps
  }, /*#__PURE__*/React.createElement(List, _extends({}, listProps, {
    role: "menu",
    items: itemsToRender
  })));
};

ActionMenuBase.displayName = "ActionMenuBase";
ActionMenuBase.displayName = 'ActionMenu';
/**
 * @deprecated Use ActionMenu with composable API instead. See https://primer.style/react/ActionMenu for more details.
 */

const ActionMenu = Object.assign(ActionMenuBase, {
  Divider,
  Item: ActionMenuItem
});

export { ActionMenu };
