'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var useProvidedStateOrCreate = require('../hooks/useProvidedStateOrCreate.js');
var useProvidedRefOrCreate = require('../hooks/useProvidedRefOrCreate.js');
var AnchoredOverlay = require('../AnchoredOverlay/AnchoredOverlay.js');
var FilteredActionList = require('../FilteredActionList/FilteredActionList.js');
var DropdownButton = require('../deprecated/DropdownMenu/DropdownButton.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function isMultiSelectVariant(selected) {
  return Array.isArray(selected);
}

const focusZoneSettings = {
  // Let FilteredActionList handle focus zone
  disabled: true
};
function SelectPanel({
  open,
  onOpenChange,
  renderAnchor = props => /*#__PURE__*/React__default["default"].createElement(DropdownButton.DropdownButton, props),
  anchorRef: externalAnchorRef,
  placeholder,
  selected,
  onSelectedChange,
  filterValue: externalFilterValue,
  onFilterChange: externalOnFilterChange,
  items,
  textInputProps,
  overlayProps,
  sx,
  ...listProps
}) {
  const [filterValue, setInternalFilterValue] = useProvidedStateOrCreate.useProvidedStateOrCreate(externalFilterValue, undefined, '');
  const onFilterChange = React.useCallback((value, e) => {
    externalOnFilterChange(value, e);
    setInternalFilterValue(value);
  }, [externalOnFilterChange, setInternalFilterValue]);
  const anchorRef = useProvidedRefOrCreate.useProvidedRefOrCreate(externalAnchorRef);
  const onOpen = React.useCallback(gesture => onOpenChange(true, gesture), [onOpenChange]);
  const onClose = React.useCallback(gesture => {
    onOpenChange(false, gesture);
  }, [onOpenChange]);
  const renderMenuAnchor = React.useMemo(() => {
    if (renderAnchor === null) {
      return null;
    }

    const selectedItems = Array.isArray(selected) ? selected : [...(selected ? [selected] : [])];
    return props => {
      return renderAnchor({ ...props,
        children: selectedItems.length ? selectedItems.map(item => item.text).join(', ') : placeholder
      });
    };
  }, [placeholder, renderAnchor, selected]);
  const itemsToRender = React.useMemo(() => {
    return items.map(item => {
      const isItemSelected = isMultiSelectVariant(selected) ? selected.includes(item) : selected === item;
      return { ...item,
        role: 'option',
        selected: 'selected' in item && item.selected === undefined ? undefined : isItemSelected,
        onAction: (itemFromAction, event) => {
          var _item$onAction;

          (_item$onAction = item.onAction) === null || _item$onAction === void 0 ? void 0 : _item$onAction.call(item, itemFromAction, event);

          if (event.defaultPrevented) {
            return;
          }

          if (isMultiSelectVariant(selected)) {
            const otherSelectedItems = selected.filter(selectedItem => selectedItem !== item);
            const newSelectedItems = selected.includes(item) ? otherSelectedItems : [...otherSelectedItems, item];
            const multiSelectOnChange = onSelectedChange;
            multiSelectOnChange(newSelectedItems);
            return;
          } // single select


          const singleSelectOnChange = onSelectedChange;
          singleSelectOnChange(item === selected ? undefined : item);
          onClose('selection');
        }
      };
    });
  }, [onClose, onSelectedChange, items, selected]);
  const inputRef = React__default["default"].useRef(null);
  const focusTrapSettings = {
    initialFocusRef: inputRef
  };
  const extendedTextInputProps = React.useMemo(() => {
    return {
      sx: {
        m: 2
      },
      contrast: true,
      ...textInputProps
    };
  }, [textInputProps]);
  return /*#__PURE__*/React__default["default"].createElement(AnchoredOverlay.AnchoredOverlay, {
    renderAnchor: renderMenuAnchor,
    anchorRef: anchorRef,
    open: open,
    onOpen: onOpen,
    onClose: onClose,
    overlayProps: overlayProps,
    focusTrapSettings: focusTrapSettings,
    focusZoneSettings: focusZoneSettings
  }, /*#__PURE__*/React__default["default"].createElement(FilteredActionList.FilteredActionList, _extends({
    filterValue: filterValue,
    onFilterChange: onFilterChange
  }, listProps, {
    role: "listbox",
    "aria-multiselectable": isMultiSelectVariant(selected) ? 'true' : 'false',
    selectionVariant: isMultiSelectVariant(selected) ? 'multiple' : 'single',
    items: itemsToRender,
    textInputProps: extendedTextInputProps,
    inputRef: inputRef // inheriting height and maxHeight ensures that the FilteredActionList is never taller
    // than the Overlay (which would break scrolling the items)
    ,
    sx: { ...sx,
      height: 'inherit',
      maxHeight: 'inherit'
    }
  })));
}
SelectPanel.displayName = "SelectPanel";
SelectPanel.displayName = 'SelectPanel';

exports.SelectPanel = SelectPanel;
