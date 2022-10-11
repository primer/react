'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var utils = require('@primer/behaviors/utils');
var useProvidedRefOrCreate = require('./useProvidedRefOrCreate.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/*
 * A mnemonic indicates to the user which key to press (single)
 * to activate a command or navigate to a component
 * typically appearing in a menu title, menu item, or the text of a button.
 */

const useMnemonics = (open, providedRef) => {
  const containerRef = useProvidedRefOrCreate.useProvidedRefOrCreate(providedRef);
  React__default["default"].useEffect(function addAriaKeyshortcuts() {
    if (!open || !containerRef.current) return;
    const container = containerRef.current;
    const focusableItems = [...utils.iterateFocusableElements(container)];
    focusableItems.map(item => {
      var _item$textContent;

      // if item already has aria-keyshortcuts defined by user, skip
      if (item.getAttribute('aria-keyshortcuts')) return;
      const firstLetter = (_item$textContent = item.textContent) === null || _item$textContent === void 0 ? void 0 : _item$textContent.toLowerCase()[0];
      if (firstLetter) item.setAttribute('aria-keyshortcuts', firstLetter);
    });
  }, [open, containerRef]);
  React__default["default"].useEffect(function handleKeyDown() {
    if (!open || !containerRef.current) return;
    const container = containerRef.current;

    const handler = event => {
      var _elementToFocus;

      // skip if a TextInput has focus
      const activeElement = document.activeElement;
      if (activeElement.tagName === 'INPUT') return; // skip if used with modifier to preserve shortcuts like ⌘ + F

      const hasModifier = event.ctrlKey || event.altKey || event.metaKey;
      if (hasModifier) return; // skip if it's not a alphabet key

      if (!isAlphabetKey(event)) return; // if this is a typeahead event, don't propagate outside of menu

      event.stopPropagation();
      const query = event.key.toLowerCase();
      let elementToFocus;
      const focusableItems = [...utils.iterateFocusableElements(container)];
      const itemsMatchingKey = focusableItems.filter(item => {
        var _item$getAttribute;

        const keyshortcuts = (_item$getAttribute = item.getAttribute('aria-keyshortcuts')) === null || _item$getAttribute === void 0 ? void 0 : _item$getAttribute.split(' ').map(shortcut => shortcut.toLowerCase());
        return keyshortcuts && keyshortcuts.includes(query);
      });
      const currentActiveIndex = itemsMatchingKey.indexOf(activeElement); // If the last element is already selected, cycle through the list

      if (currentActiveIndex === itemsMatchingKey.length - 1) {
        elementToFocus = itemsMatchingKey[0];
      } else {
        elementToFocus = itemsMatchingKey.find((item, index) => {
          return index > currentActiveIndex;
        });
      }

      (_elementToFocus = elementToFocus) === null || _elementToFocus === void 0 ? void 0 : _elementToFocus.focus();
    };

    container.addEventListener('keydown', handler);
    return () => container.removeEventListener('keydown', handler);
  }, [open, containerRef]);

  const isAlphabetKey = event => {
    return event.key.length === 1 && /[a-z\d]/i.test(event.key);
  };

  return {
    containerRef
  };
};

exports.useMnemonics = useMnemonics;
