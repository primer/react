'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var useSafeTimeout = require('../hooks/useSafeTimeout.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function useTypeahead({
  containerRef,
  onFocusChange
}) {
  const [searchValue, setSearchValue] = React__default["default"].useState('');
  const timeoutRef = React__default["default"].useRef(0);
  const onFocusChangeRef = React__default["default"].useRef(onFocusChange);
  const {
    safeSetTimeout,
    safeClearTimeout
  } = useSafeTimeout(); // Update the ref when the callback changes

  React__default["default"].useEffect(() => {
    onFocusChangeRef.current = onFocusChange;
  }, [onFocusChange]); // Update the search value when the user types

  React__default["default"].useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    function onKeyDown(event) {
      // Ignore key presses that don't produce a character value
      if (!event.key || event.key.length > 1) return; // Ignore key presses that occur with a modifier

      if (event.ctrlKey || event.altKey || event.metaKey) return; // Update the existing search value with the new key press

      setSearchValue(value => value + event.key); // Reset the timeout

      safeClearTimeout(timeoutRef.current);
      timeoutRef.current = safeSetTimeout(() => setSearchValue(''), 300); // Prevent default behavior

      event.preventDefault();
      event.stopPropagation();
    }

    container.addEventListener('keydown', onKeyDown);
    return () => container.removeEventListener('keydown', onKeyDown);
  }, [containerRef, safeClearTimeout, safeSetTimeout]); // Update focus when the search value changes

  React__default["default"].useEffect(() => {
    // Don't change focus if the search value is empty
    if (!searchValue) return;
    if (!containerRef.current) return;
    const container = containerRef.current; // Get focusable elements

    const elements = Array.from(container.querySelectorAll('[role="treeitem"]')) // Filter out collapsed items
    .filter(element => {
      var _element$parentElemen;

      return !((_element$parentElemen = element.parentElement) !== null && _element$parentElemen !== void 0 && _element$parentElemen.closest('[role=treeitem][aria-expanded=false]'));
    }); // Get the index of active descendant

    const activeDescendantIndex = elements.findIndex(element => {
      var _containerRef$current;

      return element.id === ((_containerRef$current = containerRef.current) === null || _containerRef$current === void 0 ? void 0 : _containerRef$current.getAttribute('aria-activedescendant'));
    }); // Wrap the array elements such that the active descendant is at the beginning

    let sortedElements = wrapArray(elements, activeDescendantIndex); // Remove the active descendant from the beginning of the array
    // when the user initiates a new search

    if (searchValue.length === 1) {
      sortedElements = sortedElements.slice(1);
    } // Find the first element that matches the search value


    const nextElement = sortedElements.find(element => {
      const name = getAccessibleName(element).toLowerCase();
      return name.startsWith(searchValue.toLowerCase());
    }); // If a match is found, focus it

    if (nextElement) {
      onFocusChangeRef.current(nextElement);
    }
  }, [searchValue, containerRef]);
}
/**
 * Returns the accessible name of an element
 */

function getAccessibleName(element) {
  var _document$getElementB, _document$getElementB2, _element$textContent;

  const label = element.getAttribute('aria-label');
  const labelledby = element.getAttribute('aria-labelledby');
  if (label) return label;
  if (labelledby) return (_document$getElementB = (_document$getElementB2 = document.getElementById(labelledby)) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.textContent) !== null && _document$getElementB !== void 0 ? _document$getElementB : '';
  return (_element$textContent = element.textContent) !== null && _element$textContent !== void 0 ? _element$textContent : '';
}
/**
 * Wraps an array around itself at a given start index
 *
 * @example
 * wrapArray(['a', 'b', 'c', 'd'], 2) // ['c', 'd', 'a', 'b']
 */


function wrapArray(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}

exports.useTypeahead = useTypeahead;
