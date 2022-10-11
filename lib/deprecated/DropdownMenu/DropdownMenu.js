'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var List = require('../ActionList/List.js');
var DropdownButton = require('./DropdownButton.js');
var useProvidedRefOrCreate = require('../../hooks/useProvidedRefOrCreate.js');
var useProvidedStateOrCreate = require('../../hooks/useProvidedStateOrCreate.js');
var AnchoredOverlay = require('../../AnchoredOverlay/AnchoredOverlay.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * @deprecated Use ActionMenu with ActionList instead. See https://primer.style/react/ActionMenu#with-selection for more details.
 */
function DropdownMenu({
  renderAnchor = props => /*#__PURE__*/React__default["default"].createElement(DropdownButton.DropdownButton, props),
  anchorRef: externalAnchorRef,
  placeholder,
  selectedItem,
  onChange,
  overlayProps,
  items,
  open,
  onOpenChange,
  ...listProps
}) {
  const [combinedOpenState, setCombinedOpenState] = useProvidedStateOrCreate.useProvidedStateOrCreate(open, onOpenChange, false);
  const onOpen = React.useCallback(() => setCombinedOpenState(true), [setCombinedOpenState]);
  const onClose = React.useCallback(() => setCombinedOpenState(false), [setCombinedOpenState]);
  const anchorRef = useProvidedRefOrCreate.useProvidedRefOrCreate(externalAnchorRef);
  const renderMenuAnchor = React.useMemo(() => {
    if (renderAnchor === null) {
      return null;
    }

    return props => {
      var _selectedItem$text;

      return renderAnchor({ ...props,
        children: (_selectedItem$text = selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.text) !== null && _selectedItem$text !== void 0 ? _selectedItem$text : placeholder
      });
    };
  }, [placeholder, renderAnchor, selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.text]);
  const itemsToRender = React.useMemo(() => {
    return items.map(item => {
      return { ...item,
        role: 'option',
        selected: item === selectedItem,
        onAction: (itemFromAction, event) => {
          var _item$onAction;

          (_item$onAction = item.onAction) === null || _item$onAction === void 0 ? void 0 : _item$onAction.call(item, itemFromAction, event);

          if (event.defaultPrevented) {
            return;
          }

          onClose();
          onChange === null || onChange === void 0 ? void 0 : onChange(item === selectedItem ? undefined : item);
        }
      };
    });
  }, [items, onChange, onClose, selectedItem]);
  return /*#__PURE__*/React__default["default"].createElement(AnchoredOverlay.AnchoredOverlay, {
    renderAnchor: renderMenuAnchor,
    anchorRef: anchorRef,
    open: combinedOpenState,
    onOpen: onOpen,
    onClose: onClose,
    overlayProps: overlayProps
  }, /*#__PURE__*/React__default["default"].createElement(List.List, _extends({}, listProps, {
    role: "listbox",
    items: itemsToRender
  })));
}
DropdownMenu.displayName = "DropdownMenu";
DropdownMenu.displayName = 'DropdownMenu';

exports.DropdownMenu = DropdownMenu;
