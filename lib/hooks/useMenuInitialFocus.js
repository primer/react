'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var utils = require('@primer/behaviors/utils');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const useMenuInitialFocus = (open, containerRef, anchorRef) => {
  /**
   * We need to pick the first element to focus based on how the menu was opened,
   * however, we need to wait for the menu to be open to set focus.
   * This is why we use set openingKey in state and have 2 effects
   */
  const [openingGesture, setOpeningGesture] = React__default["default"].useState(undefined);
  React__default["default"].useEffect(function inferOpeningKey() {
    const anchorElement = anchorRef.current;

    const clickHandler = event => {
      // event.detail === 0 means onClick was fired by Enter/Space key
      // https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail
      if (event.detail !== 0) setOpeningGesture('mouse-click');
    };

    const keydownHandler = event => {
      if (['Space', 'Enter', 'ArrowDown', 'ArrowUp'].includes(event.code)) {
        setOpeningGesture(event.code);
      }
    };

    anchorElement === null || anchorElement === void 0 ? void 0 : anchorElement.addEventListener('click', clickHandler);
    anchorElement === null || anchorElement === void 0 ? void 0 : anchorElement.addEventListener('keydown', keydownHandler);
    return () => {
      anchorElement === null || anchorElement === void 0 ? void 0 : anchorElement.removeEventListener('click', clickHandler);
      anchorElement === null || anchorElement === void 0 ? void 0 : anchorElement.removeEventListener('keydown', keydownHandler);
    };
  }, [anchorRef]);
  /**
   * Pick the first element to focus based on the key used to open the Menu
   * Click: anchor
   * ArrowDown | Space | Enter: first element
   * ArrowUp: last element
   */

  React__default["default"].useEffect(function moveFocusOnOpen() {
    if (!open || !containerRef.current) return; // wait till the menu is open

    const iterable = utils.iterateFocusableElements(containerRef.current);

    if (openingGesture === 'mouse-click') {
      if (anchorRef.current) anchorRef.current.focus();else throw new Error('For focus management, please attach anchorRef');
    } else if (openingGesture && ['ArrowDown', 'Space', 'Enter'].includes(openingGesture)) {
      const firstElement = iterable.next().value;
      /** We push imperative focus to the next tick to prevent React's batching */

      setTimeout(() => firstElement === null || firstElement === void 0 ? void 0 : firstElement.focus());
    } else if ('ArrowUp' === openingGesture) {
      const elements = [...iterable];
      const lastElement = elements[elements.length - 1];
      setTimeout(() => lastElement.focus());
    } else {
      /** if the menu was not opened with the anchor, we default to the first element
       *  for example: with keyboard shortcut (see stories/fixtures)
       */
      const firstElement = iterable.next().value;
      setTimeout(() => firstElement === null || firstElement === void 0 ? void 0 : firstElement.focus());
    }
  }, // we don't want containerRef in dependencies
  // because re-renders to containerRef while it's open should not fire initialMenuFocus
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [open, openingGesture, anchorRef]);
};

exports.useMenuInitialFocus = useMenuInitialFocus;
