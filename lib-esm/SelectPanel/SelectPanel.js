import React, { useCallback, useMemo } from 'react';
import { useProvidedStateOrCreate } from '../hooks/useProvidedStateOrCreate.js';
import { useProvidedRefOrCreate } from '../hooks/useProvidedRefOrCreate.js';
import { AnchoredOverlay } from '../AnchoredOverlay/AnchoredOverlay.js';
import { FilteredActionList } from '../FilteredActionList/FilteredActionList.js';
import { DropdownButton } from '../deprecated/DropdownMenu/DropdownButton.js';

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
  renderAnchor = props => /*#__PURE__*/React.createElement(DropdownButton, props),
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
  const [filterValue, setInternalFilterValue] = useProvidedStateOrCreate(externalFilterValue, undefined, '');
  const onFilterChange = useCallback((value, e) => {
    externalOnFilterChange(value, e);
    setInternalFilterValue(value);
  }, [externalOnFilterChange, setInternalFilterValue]);
  const anchorRef = useProvidedRefOrCreate(externalAnchorRef);
  const onOpen = useCallback(gesture => onOpenChange(true, gesture), [onOpenChange]);
  const onClose = useCallback(gesture => {
    onOpenChange(false, gesture);
  }, [onOpenChange]);
  const renderMenuAnchor = useMemo(() => {
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
  const itemsToRender = useMemo(() => {
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
  const inputRef = React.useRef(null);
  const focusTrapSettings = {
    initialFocusRef: inputRef
  };
  const extendedTextInputProps = useMemo(() => {
    return {
      sx: {
        m: 2
      },
      contrast: true,
      ...textInputProps
    };
  }, [textInputProps]);
  return /*#__PURE__*/React.createElement(AnchoredOverlay, {
    renderAnchor: renderMenuAnchor,
    anchorRef: anchorRef,
    open: open,
    onOpen: onOpen,
    onClose: onClose,
    overlayProps: overlayProps,
    focusTrapSettings: focusTrapSettings,
    focusZoneSettings: focusZoneSettings
  }, /*#__PURE__*/React.createElement(FilteredActionList, _extends({
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

export { SelectPanel };
