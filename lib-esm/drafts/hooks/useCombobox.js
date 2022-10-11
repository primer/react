import Combobox from '@github/combobox-nav';
import { useSSRSafeId } from '@react-aria/ssr';
import { useRef, useState, useCallback, useEffect, useLayoutEffect } from 'react';

/**
 * Lightweight hook wrapper around the GitHub `Combobox` class from `@github/combobox-nav`.
 * With this hook, keyboard navigation through suggestions is automatically handled and
 * accessibility attributes are added.
 *
 * `useCombobox` will set nearly all necessary attributes by effect, but you **must** set
 * `role="option"` on list items in order for them to be 'seen' by the combobox. Style the
 * currently highlighted option with the `[aria-selected="true"]` selector.
 */
const useCombobox = ({
  isOpen,
  listElement: list,
  inputElement: input,
  onCommit: externalOnCommit,
  options,
  tabInsertsSuggestions = false,
  defaultFirstOption = false
}) => {
  const id = useSSRSafeId();
  const optionIdPrefix = `combobox-${id}__option`;
  const isOpenRef = useRef(isOpen);
  const [comboboxInstance, setComboboxInstance] = useState(null);
  /** Get all option element instances. */

  const getOptionElements = useCallback(() => {
    var _list$querySelectorAl;

    return [...((_list$querySelectorAl = list === null || list === void 0 ? void 0 : list.querySelectorAll('[role=option]')) !== null && _list$querySelectorAl !== void 0 ? _list$querySelectorAl : [])];
  }, [list]);
  const onCommit = useCallback(e => {
    const nativeEvent = e;
    const indexAttr = nativeEvent.target.getAttribute('data-combobox-list-index');
    const index = indexAttr !== null ? parseInt(indexAttr, 10) : NaN;
    const option = options[index];
    if (option) externalOnCommit({
      nativeEvent,
      option
    });
  }, [options, externalOnCommit]); // Prevent focus leaving the input when clicking an item

  const onOptionMouseDown = useCallback(e => e.preventDefault(), []);
  useEffect(function initializeComboboxInstance() {
    if (input && list) {
      if (!list.getAttribute('role')) list.setAttribute('role', 'listbox');
      const cb = new Combobox(input, list, {
        tabInsertsSuggestions,
        defaultFirstOption
      });
      if (isOpenRef.current) cb.start(); // By using state instead of a ref here, we trigger the toggleKeyboardEventHandling
      // effect. Otherwise we'd have to depend on isOpen in this effect to start the instance
      // if it's initially open

      setComboboxInstance(cb);
      return () => {
        cb.destroy();
        setComboboxInstance(null);
      };
    }
  }, [input, list, tabInsertsSuggestions, defaultFirstOption]);
  useEffect(function toggleKeyboardEventHandling() {
    const wasOpen = isOpenRef.current;
    isOpenRef.current = isOpen;
    if (isOpen === wasOpen || !comboboxInstance) return;

    if (isOpen) {
      comboboxInstance.start();
    } else {
      comboboxInstance.stop();
    }
  }, [isOpen, comboboxInstance]);
  useEffect(function bindCommitEvent() {
    list === null || list === void 0 ? void 0 : list.addEventListener('combobox-commit', onCommit);
    return () => list === null || list === void 0 ? void 0 : list.removeEventListener('combobox-commit', onCommit);
  }, [onCommit, list]);
  useLayoutEffect(() => {
    const optionElements = getOptionElements(); // Ensure each option has a unique ID (required by the Combobox class), but respect user provided IDs

    for (const [i, option] of optionElements.entries()) {
      if (!option.id || option.id.startsWith(optionIdPrefix)) option.id = `${optionIdPrefix}-${i}`;
      option.setAttribute('data-combobox-list-index', i.toString());
      option.addEventListener('mousedown', onOptionMouseDown); // the combobox class has a bug where it resets the default on navigate, but not on clearSelection

      option.removeAttribute('data-combobox-option-default');
    }

    comboboxInstance === null || comboboxInstance === void 0 ? void 0 : comboboxInstance.clearSelection();
    return () => {
      for (const option of optionElements) option.removeEventListener('mousedown', onOptionMouseDown);
    };
  }, [getOptionElements, optionIdPrefix, options, comboboxInstance, onOptionMouseDown]);
};

export { useCombobox };
