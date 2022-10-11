'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var utils = require('@primer/behaviors/utils');
var useMenuInitialFocus = require('./useMenuInitialFocus.js');
var useMnemonics = require('./useMnemonics.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/**
 * Keyboard navigation is a mix of 4 hooks
 * 1. useMenuInitialFocus
 * 2. useTypeaheadFocus
 * 3. useCloseMenuOnTab
 * 4. useMoveFocusToMenuItem
 */
const useMenuKeyboardNavigation = (open, onClose, containerRef, anchorRef) => {
  useMenuInitialFocus.useMenuInitialFocus(open, containerRef, anchorRef);
  useMnemonics.useMnemonics(open, containerRef);
  useCloseMenuOnTab(open, onClose, containerRef, anchorRef);
  useMoveFocusToMenuItem(open, containerRef, anchorRef);
};
/**
 * When Tab or Shift+Tab is pressed, the menu should close
 * and the focus should naturally move to the next item
 */

const useCloseMenuOnTab = (open, onClose, containerRef, anchorRef) => {
  React__default["default"].useEffect(() => {
    const container = containerRef.current;
    const anchor = anchorRef.current;

    const handler = event => {
      if (open && event.key === 'Tab') onClose === null || onClose === void 0 ? void 0 : onClose('tab');
    };

    container === null || container === void 0 ? void 0 : container.addEventListener('keydown', handler);
    anchor === null || anchor === void 0 ? void 0 : anchor.addEventListener('keydown', handler);
    return () => {
      container === null || container === void 0 ? void 0 : container.removeEventListener('keydown', handler);
      anchor === null || anchor === void 0 ? void 0 : anchor.removeEventListener('keydown', handler);
    };
  }, [open, onClose, containerRef, anchorRef]);
};
/**
 * When Arrow Keys are pressed and the focus is on the anchor,
 * focus should move to a menu item
 */


const useMoveFocusToMenuItem = (open, containerRef, anchorRef) => {
  React__default["default"].useEffect(() => {
    const container = containerRef.current;
    const anchor = anchorRef.current;

    const handler = event => {
      if (!open || !container) return;
      const iterable = utils.iterateFocusableElements(container);

      if (event.key === 'ArrowDown') {
        // TODO: does commenting this out break anything?
        // event.preventDefault() // prevent scroll event
        const firstElement = iterable.next().value;
        /** We push imperative focus to the next tick to prevent React's batching */

        setTimeout(() => firstElement === null || firstElement === void 0 ? void 0 : firstElement.focus());
      } else if (event.key === 'ArrowUp') {
        // TODO: does commenting this out break anything?
        // event.preventDefault() // prevent scroll event
        const elements = [...iterable];
        const lastElement = elements[elements.length - 1];
        setTimeout(() => lastElement.focus());
      }
    };

    anchor === null || anchor === void 0 ? void 0 : anchor.addEventListener('keydown', handler);
    return () => anchor === null || anchor === void 0 ? void 0 : anchor.addEventListener('keydown', handler);
  }, [open, containerRef, anchorRef]);
};

exports.useMenuKeyboardNavigation = useMenuKeyboardNavigation;
